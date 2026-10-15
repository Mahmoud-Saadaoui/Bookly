import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { vehiclesAPI, bookingsAPI, branchesAPI } from "../../api/endpoints";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/format";
import { getApiErrorMessage } from "../../utils/apiError";
import toast from "react-hot-toast";

const VehicleDetailPage = () => {
  const { t } = useTranslation();
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
      const allRes = await vehiclesAPI.getAll({ limit: 100 });
      if (allRes.data.success) {
        const found = allRes.data.data.find((v) => v._id === id);
        if (found) {
          setVehicle(found);
        } else {
          toast.error(t("vehicleDetail.notFound"));
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
      toast.error(t("vehicleDetail.selectDates"));
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
        toast.success(t("vehicleDetail.quoteOk"));
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, t("vehicleDetail.quoteError"));
      toast.error(msg);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error(t("vehicleDetail.loginRequired"));
      navigate("/login");
      return;
    }
    if (!quote) {
      toast.error(t("vehicleDetail.quoteFirst"));
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
        toast.success(t("vehicleDetail.bookingSuccess"));
        navigate("/my-bookings");
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, t("vehicleDetail.bookingError"));
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
      <div className="min-h-screen bg-dark flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark px-6 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <Link to="/vehicles" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("vehicleDetail.back")}
        </Link>

        {!vehicle ? (
          <div className="text-center py-24 text-gray-400">{t("vehicleDetail.notFound")}</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main info */}
            <div className="lg:col-span-2">
              <div className="bg-dark-light/50 border border-white/10 rounded-2xl overflow-hidden">
                <div className="aspect-[16/9] bg-linear-to-br from-dark-light to-dark relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div className="absolute top-4 start-4">
                    <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full backdrop-blur-sm">
                      {vehicle.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h1 className="text-3xl md:text-4xl font-cairo font-bold mb-2">
                    {vehicle.make} {vehicle.model}
                  </h1>
                  <p className="text-gray-400">
                    {vehicle.category} • {vehicle.transmission} • {vehicle.fuelType}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    <div className="bg-dark/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">{t("vehicleDetail.seats")}</p>
                      <p className="text-lg font-semibold">{vehicle.seats}</p>
                    </div>
                    <div className="bg-dark/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">{t("vehicleDetail.transmission")}</p>
                      <p className="text-lg font-semibold">{vehicle.transmission}</p>
                    </div>
                    <div className="bg-dark/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">{t("vehicleDetail.fuel")}</p>
                      <p className="text-lg font-semibold">{vehicle.fuelType}</p>
                    </div>
                    <div className="bg-dark/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">{t("vehicleDetail.registration")}</p>
                      <p className="text-lg font-semibold">{vehicle.registrationNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking panel */}
            <div className="lg:col-span-1">
              <div className="bg-dark-light/50 border border-white/10 rounded-2xl p-6 sticky top-24">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-accent">{formatCurrency(vehicle.dailyRateCents)}</span>
                  <span className="text-gray-400">{t("vehicleDetail.perDay")}</span>
                </div>

                <button
                  onClick={() => setShowBookingForm(!showBookingForm)}
                  className="w-full py-3 bg-accent text-dark font-semibold rounded-lg hover:bg-accent-light transition-colors mb-6"
                >
                  {showBookingForm ? t("vehicleDetail.cancel") : t("vehicleDetail.book")}
                </button>

                {showBookingForm && (
                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">{t("vehicleDetail.pickupDate")}</label>
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
                      <label className="block text-sm text-gray-400 mb-2">{t("vehicleDetail.returnDate")}</label>
                      <input
                        type="datetime-local"
                        name="endAt"
                        value={bookingData.endAt}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">{t("vehicleDetail.pickupBranch")}</label>
                      <select
                        name="pickupBranch"
                        value={bookingData.pickupBranch}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                      >
                        <option value="">{t("vehicleDetail.select")}</option>
                        {branches.map((b) => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">{t("vehicleDetail.returnBranch")}</label>
                      <select
                        name="returnBranch"
                        value={bookingData.returnBranch}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                      >
                        <option value="">{t("vehicleDetail.select")}</option>
                        {branches.map((b) => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">{t("vehicleDetail.notes")}</label>
                      <textarea
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder={t("vehicleDetail.notesPlaceholder")}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={getQuote}
                      className="w-full py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {t("vehicleDetail.quote")}
                    </button>

                    {quote && (
                      <div className="bg-dark border border-accent/30 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t("vehicleDetail.dailyRate")}</span>
                          <span>{formatCurrency(quote.pricing.dailyRateCents)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t("vehicleDetail.days")}</span>
                          <span>{quote.pricing.rentalDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t("vehicleDetail.subtotal")}</span>
                          <span>{formatCurrency(quote.pricing.subtotalCents)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t("vehicleDetail.tax")}</span>
                          <span>{formatCurrency(quote.pricing.taxCents)}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-2 mt-2 text-lg font-semibold">
                          <span>{t("vehicleDetail.total")}</span>
                          <span className="text-accent">{formatCurrency(quote.pricing.totalCents)}</span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || !quote}
                      className="w-full py-3 bg-accent text-dark font-semibold rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? t("vehicleDetail.booking") : t("vehicleDetail.confirm")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailPage;
