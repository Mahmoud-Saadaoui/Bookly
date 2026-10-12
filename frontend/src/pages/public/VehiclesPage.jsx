import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { vehiclesAPI, branchesAPI } from "../../api/endpoints";
import { formatCurrency } from "../../utils/format";
import toast from "react-hot-toast";

const VEHICLE_CATEGORIES = ["Premium", "Sport", "Business", "Électrique", "SUV", "Citadine"];

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    category: "",
    branch: "",
    from: "",
    to: "",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [filters, pagination.page]);

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

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const res = await vehiclesAPI.getAll(params);
      if (res.data.success) {
        setVehicles(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error("Erreur lors du chargement des véhicules");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleReset = () => {
    setFilters({ category: "", branch: "", from: "", to: "" });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-cairo font-bold mb-4">
            Notre <span className="text-accent">Flotte</span>
          </h1>
          <p className="text-gray-400 font-cairo">Découvrez notre sélection de véhicules premium</p>
        </div>

        {/* Filtres */}
        <div className="bg-dark-light/50 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Catégorie</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
              >
                <option value="">Toutes</option>
                {VEHICLE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Agence</label>
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
              >
                <option value="">Toutes</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>{branch.name} ({branch.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Date début</label>
              <input
                type="date"
                name="from"
                value={filters.from}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Date fin</label>
              <input
                type="date"
                name="to"
                value={filters.to}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full py-2 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste véhicules */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Aucun véhicule ne correspond à vos critères</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="group bg-dark-light/50 border border-white/10 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-dark-light to-dark relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                        {vehicle.category}
                      </span>
                    </div>
                    {(filters.from && filters.to && vehicle.available === false) && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
                          Non disponible
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-cairo font-semibold mb-1 group-hover:text-accent transition-colors">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{vehicle.transmission} • {vehicle.fuelType} • {vehicle.seats} places</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500">À partir de</span>
                        <p className="text-2xl font-bold text-accent">{formatCurrency(vehicle.dailyRateCents)}</p>
                        <span className="text-xs text-gray-400">/jour</span>
                      </div>
                      <Link
                        to={`/vehicles/${vehicle._id}`}
                        className="px-4 py-2 border border-white/20 text-sm rounded-full hover:bg-white/10 transition-colors"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;
