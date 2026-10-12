import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { agentBookingsAPI } from "../../api/endpoints";
import { formatDateTime, formatCurrency } from "../../utils/format";
import toast from "react-hot-toast";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await agentBookingsAPI.getAll({ limit: 1000 });
      if (res.data.success) {
        const evts = res.data.data
          .filter(b => ["confirmed", "active"].includes(b.status))
          .map(b => ({
            id: b._id,
            title: `${b.vehicle?.make} ${b.vehicle?.model} - ${b.customer?.name || ""}`,
            start: b.startAt,
            end: b.endAt,
            backgroundColor: b.status === "active" ? "#22c55e" : "#3b82f6",
            borderColor: "transparent",
            extendedProps: { booking: b }
          }));
        setEvents(evts);
      }
    } catch (err) {
      toast.error("Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps.booking);
    setShowModal(true);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-cairo font-bold mb-2">Calendrier des réservations</h1>
        <p className="text-gray-400">Réservations confirmées et en cours</p>
      </div>
      <div className="bg-dark-light/50 border border-white/10 rounded-xl p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          events={events}
          eventClick={handleEventClick}
          height="700px"
          themeSystem="standard"
        />
      </div>

      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-dark-light border border-white/10 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Détails réservation</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">Client:</span> {selectedEvent.customer?.name}</div>
              <div><span className="text-gray-400">Véhicule:</span> {selectedEvent.vehicle?.make} {selectedEvent.vehicle?.model}</div>
              <div><span className="text-gray-400">Début:</span> {formatDateTime(selectedEvent.startAt)}</div>
              <div><span className="text-gray-400">Fin:</span> {formatDateTime(selectedEvent.endAt)}</div>
              <div><span className="text-gray-400">Montant:</span> {formatCurrency(selectedEvent.pricing?.totalCents)}</div>
              <div><span className="text-gray-400">Statut:</span> {selectedEvent.status}</div>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-6 w-full py-2 border border-white/20 rounded-lg">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
