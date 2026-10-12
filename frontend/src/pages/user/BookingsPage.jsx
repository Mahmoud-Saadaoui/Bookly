import { useState, useEffect } from "react";
import { bookingsAPI } from "../../api/endpoints";
import { formatCurrency, formatDateTime } from "../../utils/format";
import toast from "react-hot-toast";

const STATUS_LABELS = {
  pending_payment: "En attente",
  confirmed: "Confirmée",
  active: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
  no_show: "No-show",
};

const STATUS_COLORS = {
  pending_payment: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  active: "bg-green-500/20 text-green-400",
  completed: "bg-gray-500/20 text-gray-400",
  cancelled: "bg-red-500/20 text-red-400",
  no_show: "bg-orange-500/20 text-orange-400",
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [pagination.page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsAPI.getMine({ page: pagination.page, limit: pagination.limit });
      if (res.data.success) {
        setBookings(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error("Erreur lors du chargement des réservations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
            Mes <span className="text-accent">Locations</span>
          </h1>
          <p className="text-gray-400 font-raleway">Gérez vos réservations et votre historique</p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", "pending_payment", "confirmed", "active", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === status
                  ? "bg-accent text-dark"
                  : "bg-dark-light/50 border border-white/10 text-gray-300 hover:bg-white/5"
              }`}
            >
              {status === "all" ? "Toutes" : STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-dark-light/30 border border-white/10 rounded-2xl">
            <p className="text-gray-400">Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-dark-light/50 border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-montserrat font-semibold">
                          {booking.vehicle?.make} {booking.vehicle?.model}
                        </h3>
                        <p className="text-sm text-gray-400">{booking.vehicle?.registrationNumber}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[booking.status]}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Prise en charge</p>
                        <p>{formatDateTime(booking.startAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Retour</p>
                        <p>{formatDateTime(booking.endAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Nombre de jours</p>
                        <p>{booking.pricing?.rentalDays}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Montant total</p>
                        <p className="text-accent font-semibold">{formatCurrency(booking.pricing?.totalCents)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
            >
              Précédent
            </button>
            <span className="px-4 py-2 text-gray-400">
              Page {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
