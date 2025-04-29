
import { useEffect, useState, useRef } from 'react';
import { CustomCard } from '@/components/ui/CustomCard';
import { CustomButton } from '@/components/ui/CustomButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import api from '@/services/api';

interface Todo {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
  tags: string[];
  courseId: number | null;
}

export function Tasks() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [draggedItem, setDraggedItem] = useState<Todo | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // New todo form state
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'MEDIUM' as const,
    tags: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/todos');
        setTodos(response.data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tasks. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [toast]);

  // Apply filters and sorting whenever todos, filter, or sortBy changes
  useEffect(() => {
    let result = [...todos];
    
    // Apply filters
    if (filter === 'completed') {
      result = result.filter((todo) => todo.completed);
    } else if (filter === 'active') {
      result = result.filter((todo) => !todo.completed);
    }
    
    // Apply sorting
    if (sortBy === 'priority') {
      const priorityValues = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      result.sort((a, b) => 
        priorityValues[b.priority] - priorityValues[a.priority]
      );
    } else if (sortBy === 'dueDate') {
      result.sort((a, b) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }
    
    setFilteredTodos(result);
  }, [todos, filter, sortBy]);

  const handleDragStart = (e: React.DragEvent, todo: Todo) => {
    setDraggedItem(todo);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const todosCopy = [...todos];
    const dragItemIndex = todosCopy.findIndex(
      (todo) => todo.id === draggedItem.id
    );
    
    if (dragItemIndex === targetIndex) return;
    
    // Remove the dragged item
    const draggedItemCopy = { ...todosCopy[dragItemIndex] };
    todosCopy.splice(dragItemIndex, 1);
    
    // Insert at the new position
    todosCopy.splice(targetIndex, 0, draggedItemCopy);
    
    setTodos(todosCopy);
    setDraggedItem(null);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleToggleComplete = (id: number) => {
    const updatedTodos = todos.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    
    // In a real app, this would update the backend as well
    toast({
      title: 'Task Updated',
      description: 'Task completion status has been updated.',
    });
  };

  const handleDeleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    
    toast({
      title: 'Task Deleted',
      description: 'Task has been removed successfully.',
    });
  };

  const handleAddTodo = () => {
    // Validate form
    if (!newTodo.title.trim()) {
      toast({
        title: 'Error',
        description: 'Task title is required.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create new todo
    const tags = newTodo.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    
    const newTodoItem: Todo = {
      id: Math.max(0, ...todos.map((t) => t.id)) + 1,
      title: newTodo.title,
      description: newTodo.description,
      dueDate: newTodo.dueDate + 'T23:59:00Z',
      priority: newTodo.priority,
      completed: false,
      tags,
      courseId: null,
    };
    
    // Add to state
    setTodos([...todos, newTodoItem]);
    
    // Reset form and close dialog
    setNewTodo({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'MEDIUM',
      tags: '',
    });
    setIsDialogOpen(false);
    
    toast({
      title: 'Task Added',
      description: 'New task has been added successfully.',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your personal and course-related tasks in one place.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CustomButton
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Task
          </CustomButton>
        </div>
      </div>

      <CustomCard className="overflow-hidden">
        <div className="rounded-md">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded-md"></div>
                </div>
              ))}
            </div>
          ) : filteredTodos.length > 0 ? (
            <ul className="divide-y">
              {filteredTodos.map((todo, index) => (
                <li
                  key={todo.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, todo)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnter={() => handleDragEnter(index)}
                  className={`p-4 flex items-start transition-colors cursor-move ${
                    draggedItem?.id === todo.id ? 'opacity-50' : ''
                  } ${todo.completed ? 'bg-muted/30' : ''}`}
                >
                  <div className="flex-shrink-0 mr-3 pt-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="h-5 w-5 rounded border-muted-foreground focus:ring-primary cursor-pointer"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between">
                      <h3
                        className={`font-medium mb-1 ${
                          todo.completed ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </div>
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full flex items-center ${
                          isOverdue(todo.dueDate) && !todo.completed
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {formatDueDate(todo.dueDate)}
                        {isOverdue(todo.dueDate) && !todo.completed && ' (Overdue)'}
                      </div>
                      {todo.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No tasks found. {filter !== 'all' && 'Try changing the filter or '}
                add a new task to get started.
              </p>
              <CustomButton onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Add Task
              </CustomButton>
            </div>
          )}
        </div>
      </CustomCard>

      {/* Add Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Task title"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                placeholder="Task description"
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid items-center gap-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={newTodo.priority}
                  onValueChange={(value: 'HIGH' | 'MEDIUM' | 'LOW') =>
                    setNewTodo({ ...newTodo, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid items-center gap-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, dueDate: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="grid w-full items-center gap-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma-separated, optional)
              </label>
              <Input
                id="tags"
                placeholder="e.g. study, project, personal"
                value={newTodo.tags}
                onChange={(e) => setNewTodo({ ...newTodo, tags: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <CustomButton
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </CustomButton>
            <CustomButton onClick={handleAddTodo}>Add Task</CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
