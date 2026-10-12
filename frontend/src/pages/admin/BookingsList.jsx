import { useState, useEffect } from "react";
import { agentBookingsAPI, bookingsAPI } from "../../api/endpoints";
import { formatCurrency, formatDateTime } from "../../utils/format";
import toast from "react-hot-toast";

const STATUSES = ["pending_payment", "confirmed", "active", "completed", "cancelled", "no_show"];

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchBookings();
  }, [pagination.page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await agentBookingsAPI.getAll({ page: pagination.page, limit: pagination.limit });
      if (res.data.success) {
        setBookings(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error("Erreur");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      toast.success("Statut mis à jour");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-bold mb-2">Réservations</h1>
        <p className="text-gray-400">Gérer les réservations</p>
      </div>
      <div className="bg-dark-light/50 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs text-gray-400 p-4">Client</th>
              <th className="text-left text-xs text-gray-400 p-4">Véhicule</th>
              <th className="text-left text-xs text-gray-400 p-4">Dates</th>
              <th className="text-left text-xs text-gray-400 p-4">Montant</th>
              <th className="text-left text-xs text-gray-400 p-4">Statut</th>
              <th className="text-right text-xs text-gray-400 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-b border-white/5">
                <td className="p-4 text-sm">{b.customer?.name || "-"}</td>
                <td className="p-4 text-sm">{b.vehicle?.make} {b.vehicle?.model}</td>
                <td className="p-4 text-sm text-gray-400">{formatDateTime(b.startAt)} → {formatDateTime(b.endAt)}</td>
                <td className="p-4 text-sm">{formatCurrency(b.pricing?.totalCents)}</td>
                <td className="p-4"><span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">{b.status}</span></td>
                <td className="p-4 text-right">
                  <select onChange={(e) => updateStatus(b._id, e.target.value)} defaultValue="" className="px-2 py-1 bg-white/5 border border-white/20 rounded text-xs">
                    <option value="" disabled>Changer</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsList;
