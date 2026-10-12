import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { vehiclesAPI, bookingsAPI, branchesAPI } from "../../api/endpoints";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency, formatDate } from "../../utils/format";
import toast from "react-hot-toast";

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [quote, setQuote] = useState(null);
  const [bookingData, setBookingData] = useState({
    startAt: "",
    endAt: "",
    pickupBranch: "",
    returnBranch: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicle();
    fetchBranches();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const res = await vehiclesAPI.getAll({}); // We need to find by id - but API returns list; better to adapt
      // Fallback: try to get by filtering logic - or just fetch all and find
      const allRes = await vehiclesAPI.getAll({ limit: 100 });
      if (allRes.data.success) {
        const found = allRes.data.data.find(v => v._id === id);
        if (found) {
          setVehicle(found);
        } else {
          toast.error("Véhicule non trouvé");
          navigate("/vehicles");
        }
      }
    } catch (err) {
      console.error(err);
      navigate("/vehicles");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await branchesAPI.getAll({ limit: 100 });
      if (res.data.success) {
        setBranches(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getQuote = async () => {
    if (!bookingData.startAt || !bookingData.endAt) {
      toast.error("Veuillez sélectionner les dates");
      return;
    }
    try {
      const res = await bookingsAPI.quote({
        vehicleId: id,
        startAt: new Date(bookingData.startAt).toISOString(),
        endAt: new Date(bookingData.endAt).toISOString(),
      });
      if (res.data.success) {
        setQuote(res.data.data);
        toast.success("Devis calculé avec succès");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors du calcul du devis";
      toast.error(msg);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour réserver");
      navigate("/login");
      return;
    }
    if (!quote) {
      toast.error("Veuillez d'abord obtenir un devis");
      return;
    }
    setSubmitting(true);
    try {
      const res = await bookingsAPI.create({
        vehicleId: id,
        startAt: new Date(bookingData.startAt).toISOString(),
        endAt: new Date(bookingData.endAt).toISOString(),
        pickupBranch: bookingData.pickupBranch || undefined,
        returnBranch: bookingData.returnBranch || undefined,
        notes: bookingData.notes,
      });
      if (res.data.success) {
        toast.success("Réservation créée avec succès");
        navigate("/my-bookings");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de la réservation";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    setQuote(null); // Reset quote if dates change
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/vehicles" className="text-accent hover:text-accent-light mb-6 inline-block">
          ← Retour à la flotte
        </Link>

        <div className="bg-dark-light/50 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <div className="aspect-[16/8] bg-gradient-to-br from-dark-light to-dark" />
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-cairo font-bold mb-2">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-gray-400">{vehicle.category} • {vehicle.transmission} • {vehicle.fuelType}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-3xl font-bold text-accent">{formatCurrency(vehicle.dailyRateCents)}</p>
                <p className="text-gray-400 text-sm">/jour</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-dark/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Places</p>
                <p className="text-lg font-semibold">{vehicle.seats}</p>
              </div>
              <div className="bg-dark/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Transmission</p>
                <p className="text-lg font-semibold">{vehicle.transmission}</p>
              </div>
              <div className="bg-dark/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Carburant</p>
                <p className="text-lg font-semibold">{vehicle.fuelType}</p>
              </div>
              <div className="bg-dark/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Immatriculation</p>
                <p className="text-lg font-semibold">{vehicle.registrationNumber}</p>
              </div>
            </div>

            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="px-8 py-3 bg-accent text-dark font-semibold rounded-lg hover:bg-accent-light transition-colors"
            >
              {showBookingForm ? "Annuler" : "Réserver ce véhicule"}
            </button>
          </div>
        </div>

        {showBookingForm && (
          <div className="bg-dark-light/50 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-cairo font-semibold mb-6">Formulaire de réservation</h2>
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date de prise en charge</label>
                  <input
                    type="datetime-local"
                    name="startAt"
                    value={bookingData.startAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date de retour</label>
                  <input
                    type="datetime-local"
                    name="endAt"
                    value={bookingData.endAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Agence de prise en charge</label>
                  <select
                    name="pickupBranch"
                    value={bookingData.pickupBranch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  >
                    <option value="">Sélectionner</option>
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Agence de retour</label>
                  <select
                    name="returnBranch"
                    value={bookingData.returnBranch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  >
                    <option value="">Sélectionner</option>
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Notes (optionnel)</label>
                <textarea
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  placeholder="Demandes particulières..."
                />
              </div>

              <button
                type="button"
                onClick={getQuote}
                className="px-6 py-3 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
              >
                Calculer le devis
              </button>

              {quote && (
                <div className="bg-dark/50 p-6 rounded-lg border border-accent/30">
                  <h3 className="text-lg font-semibold mb-4">Devis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tarif journalier</span>
                      <span>{formatCurrency(quote.pricing.dailyRateCents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nombre de jours</span>
                      <span>{quote.pricing.rentalDays}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                      <span className="font-semibold">Sous-total</span>
                      <span>{formatCurrency(quote.pricing.subtotalCents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TVA/Taxe</span>
                      <span>{formatCurrency(quote.pricing.taxCents)}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2 text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-accent">{formatCurrency(quote.pricing.totalCents)}</span>
                    </div>
                  </div>
                </div>
              )}

              {quote && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-accent text-dark font-semibold rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50"
                >
                  {submitting ? "Réservation..." : "Confirmer la réservation"}
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailPage;
