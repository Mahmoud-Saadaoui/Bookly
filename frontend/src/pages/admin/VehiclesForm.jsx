import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { vehiclesAPI, branchesAPI } from "../../api/endpoints";
import toast from "react-hot-toast";

const CATEGORIES = ["Premium", "Sport", "Business", "Électrique", "SUV", "Citadine"];
const TRANSMISSIONS = ["Automatique", "Manuelle"];
const FUEL_TYPES = ["Essence", "Diesel", "Hybride", "Électrique"];
const STATUSES = ["available", "reserved", "rented", "maintenance", "retired"];

const VehiclesForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    category: "Premium",
    registrationNumber: "",
    vin: "",
    branch: "",
    location: "",
    dailyRateCents: "",
    currency: "EUR",
    seats: "5",
    transmission: "Automatique",
    fuelType: "Essence",
    mileage: "0",
    status: "available",
  });

  useEffect(() => {
    fetchBranches();
    if (isEdit) fetchVehicle();
  }, [id]);

  const fetchBranches = async () => {
    try {
      const res = await branchesAPI.getAll({ limit: 100 });
      if (res.data.success) setBranches(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVehicle = async () => {
    try {
      const res = await vehiclesAPI.getAll({ limit: 100 });
      if (res.data.success) {
        const found = res.data.data.find(v => v._id === id);
        if (found) {
          setFormData({
            ...found,
            dailyRateCents: found.dailyRateCents.toString(),
            seats: found.seats.toString(),
            mileage: found.mileage?.toString() || "0",
          });
        }
      }
    } catch {
      toast.error(t("admin.common.error"));
      navigate("/admin/vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        dailyRateCents: parseInt(formData.dailyRateCents),
        seats: parseInt(formData.seats),
        mileage: parseInt(formData.mileage),
      };
      // Don't send empty optional fields: an empty `branch` fails the ObjectId
      // cast and an empty `vin` collides on the unique index.
      ["branch", "vin", "location"].forEach((field) => {
        if (!payload[field]) delete payload[field];
      });
      if (isEdit) {
        await vehiclesAPI.update(id, payload);
        toast.success(t("admin.vehicles.updated"));
      } else {
        await vehiclesAPI.create(payload);
        toast.success(t("admin.vehicles.created"));
      }
      navigate("/admin/vehicles");
    } catch (err) {
      toast.error(err.response?.data?.message || t("admin.common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-cairo font-bold mb-2">
          {t(isEdit ? "admin.vehicles.editTitle" : "admin.vehicles.addTitle")}
        </h1>
      </div>
      <div className="bg-dark-light/50 border border-white/10 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.brand")}</label>
              <input name="make" value={formData.make} onChange={handleChange} required className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.model")}</label>
              <input name="model" value={formData.model} onChange={handleChange} required className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.registration")}</label>
              <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.vin")}</label>
              <input name="vin" value={formData.vin} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.category")}</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{t(`admin.categories.${c}`, c)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.branch")}</label>
              <select name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white">
                <option value="">{t("admin.actions.select")}</option>
                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.dailyRate")}</label>
              <input name="dailyRateCents" value={formData.dailyRateCents} onChange={handleChange} required className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.seats")}</label>
              <input name="seats" type="number" value={formData.seats} onChange={handleChange} required className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.transmission")}</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white">
                {TRANSMISSIONS.map(tm => <option key={tm} value={tm}>{t(`admin.transmissions.${tm}`, tm)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.fuel")}</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white">
                {FUEL_TYPES.map(f => <option key={f} value={f}>{t(`admin.fuelTypes.${f}`, f)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.status")}</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white">
                {STATUSES.map(s => <option key={s} value={s}>{t(`admin.statuses.${s}`, s)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t("admin.vehicles.mileage")}</label>
              <input name="mileage" type="number" value={formData.mileage} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white" />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="px-6 py-3 bg-accent text-dark rounded-lg disabled:opacity-50">
              {t(submitting ? "admin.actions.saving" : "admin.actions.save")}
            </button>
            <button type="button" onClick={() => navigate("/admin/vehicles")} className="px-6 py-3 border border-white/20 rounded-lg">
              {t("admin.actions.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehiclesForm;
