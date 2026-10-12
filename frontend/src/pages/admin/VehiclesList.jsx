import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { vehiclesAPI } from "../../api/endpoints";
import { formatCurrency } from "../../utils/format";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchVehicles();
  }, [pagination.page]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehiclesAPI.getAll({ page: pagination.page, limit: pagination.limit });
      if (res.data.success) {
        setVehicles(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce véhicule ?")) return;
    try {
      await vehiclesAPI.delete(id);
      toast.success("Véhicule supprimé");
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-cairo font-bold mb-2">Véhicules</h1>
          <p className="text-gray-400">Gérer la flotte</p>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-dark rounded-lg hover:bg-accent-light"
        >
          <FaPlus /> Ajouter
        </Link>
      </div>

      <div className="bg-dark-light/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-400 font-normal p-4">Véhicule</th>
                <th className="text-left text-xs text-gray-400 font-normal p-4">Immatriculation</th>
                <th className="text-left text-xs text-gray-400 font-normal p-4">Catégorie</th>
                <th className="text-left text-xs text-gray-400 font-normal p-4">Tarif/jour</th>
                <th className="text-left text-xs text-gray-400 font-normal p-4">Statut</th>
                <th className="text-right text-xs text-gray-400 font-normal p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-medium">{v.make} {v.model}</div>
                    <div className="text-xs text-gray-400">{v.transmission} • {v.fuelType}</div>
                  </td>
                  <td className="p-4 text-sm">{v.registrationNumber}</td>
                  <td className="p-4 text-sm">{v.category}</td>
                  <td className="p-4 text-sm">{formatCurrency(v.dailyRateCents)}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">{v.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/vehicles/${v._id}/edit`} className="p-2 text-gray-400 hover:text-white">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(v._id)} className="p-2 text-gray-400 hover:text-red-400">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-white/20 rounded-lg disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-4 py-2 text-gray-400">{pagination.page}/{pagination.pages}</span>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border border-white/20 rounded-lg disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;
