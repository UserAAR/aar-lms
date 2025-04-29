import { useEffect, useState } from 'react';
import { CustomCard } from '@/components/ui/CustomCard';
import { CustomButton } from '@/components/ui/CustomButton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  speaker: string;
  capacity: number;
  registered: number;
  thumbnailUrl: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/events');
        const eventsData = Array.isArray(response.data) ? response.data : [];
        setEvents(eventsData);
        setFilteredEvents(eventsData);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Etkinlikler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.category.toLowerCase() === selectedFilter);
      setFilteredEvents(filtered);
    }
  }, [selectedFilter, events]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prev.getMonth() - 1);
      return prevMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(prev.getMonth() + 1);
      return nextMonth;
    });
  };

  const getEventsForDate = (date: Date) => {
    const formattedDate = date.setHours(0, 0, 0, 0);
    
    return filteredEvents.filter((event) => {
      const eventStart = new Date(event.startDate);
      eventStart.setHours(0, 0, 0, 0);
      return eventStart.getTime() === formattedDate;
    });
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 p-1 border border-muted/30"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const eventsForDay = getEventsForDate(date);
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();
      
      days.push(
        <div
          key={day}
          className={`h-24 p-1 border border-muted/30 overflow-hidden ${
            isToday ? 'bg-muted/30' : ''
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
              {day}
            </span>
          </div>
          <div className="space-y-1">
            {eventsForDay.slice(0, 2).map((event, i) => (
              <div
                key={`${event.id}-${i}`}
                className="text-xs p-1 rounded truncate"
                style={{
                  backgroundColor:
                    event.category === 'Workshop'
                      ? 'rgba(59, 130, 246, 0.1)'
                      : event.category === 'Conference'
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'rgba(16, 185, 129, 0.1)',
                  color:
                    event.category === 'Workshop'
                      ? 'rgb(59, 130, 246)'
                      : event.category === 'Conference'
                      ? 'rgb(239, 68, 68)'
                      : 'rgb(16, 185, 129)',
                }}
              >
                {event.title}
              </div>
            ))}
            {eventsForDay.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{eventsForDay.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Generate a list of upcoming events (sorted by date)
  const upcomingEvents = [...filteredEvents]
    .filter(event => new Date(event.startDate) >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">Hata</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Sayfayı Yenile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Calendar</h1>
        <p className="text-muted-foreground">
          Track upcoming events and schedule your learning activities.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Calendar View */}
        <div className="lg:w-3/4">
          <CustomCard className="p-4">
            {/* Calendar Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <CustomButton
                  variant="outline"
                  size="icon"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </CustomButton>
                <h2 className="mx-4 text-xl font-semibold">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <CustomButton
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </CustomButton>
              </div>

              <div className="flex items-center">
                <span className="mr-2 text-sm">Filter:</span>
                <Select
                  value={selectedFilter}
                  onValueChange={setSelectedFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="workshop">Workshops</SelectItem>
                    <SelectItem value="conference">Conferences</SelectItem>
                    <SelectItem value="webinar">Webinars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-sm font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0">
              {!isLoading ? (
                renderCalendarDays()
              ) : (
                // Loading state
                Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="h-24 p-1 border border-muted/30 animate-pulse bg-muted/20"
                  ></div>
                ))
              )}
            </div>
          </CustomCard>
        </div>

        {/* Upcoming Events */}
        <div className="lg:w-1/4">
          <CustomCard>
            <h3 className="font-semibold mb-4 flex items-center">
              <CalendarClock className="mr-2 h-5 w-5 text-turquoise" />
              Upcoming Events
            </h3>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 rounded-md bg-muted/30"></div>
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.slice(0, 5).map((event) => {
                  const eventDate = new Date(event.startDate);
                  return (
                    <div
                      key={event.id}
                      className="p-3 border rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded bg-muted-foreground/10 flex flex-col items-center justify-center mr-3 text-center">
                          <span className="text-xs font-medium">
                            {eventDate.toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold">{eventDate.getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.location}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              backgroundColor:
                                event.category === 'Workshop'
                                  ? 'rgba(59, 130, 246, 0.1)'
                                  : event.category === 'Conference'
                                  ? 'rgba(239, 68, 68, 0.1)'
                                  : 'rgba(16, 185, 129, 0.1)',
                              color:
                                event.category === 'Workshop'
                                  ? 'rgb(59, 130, 246)'
                                  : event.category === 'Conference'
                                  ? 'rgb(239, 68, 68)'
                                  : 'rgb(16, 185, 129)',
                            }}
                          >
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                      {event.registered < event.capacity && (
                        <div className="mt-2 text-xs flex justify-between items-center">
                          <span className="text-muted-foreground">
                            {event.registered}/{event.capacity} registered
                          </span>
                          <CustomButton size="sm" variant="outline">
                            Register
                          </CustomButton>
                        </div>
                      )}
                    </div>
                  );
                })}
                {upcomingEvents.length > 5 && (
                  <div className="text-center">
                    <CustomButton variant="ghost" size="sm">
                      View All Events
                    </CustomButton>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                No upcoming events found.
              </p>
            )}
          </CustomCard>
        </div>
      </div>
    </div>
  );
}
