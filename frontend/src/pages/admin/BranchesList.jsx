import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { branchesAPI } from "../../api/endpoints";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const BranchesList = () => {
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchBranches();
  }, [pagination.page]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await branchesAPI.getAll({ page: pagination.page, limit: pagination.limit });
      if (res.data.success) {
        setBranches(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch {
      toast.error(t("admin.common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("admin.branches.deleteConfirm"))) return;
    try {
      await branchesAPI.delete(id);
      toast.success(t("admin.branches.deleted"));
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.message || t("admin.common.error"));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-cairo font-bold mb-2">{t("admin.branches.title")}</h1>
          <p className="text-gray-400">{t("admin.branches.subtitle")}</p>
        </div>
        <Link to="/admin/branches/new" className="flex items-center gap-2 px-4 py-2 bg-accent text-dark rounded-lg hover:bg-accent-light">
          <FaPlus /> {t("admin.actions.add")}
        </Link>
      </div>
      <div className="bg-dark-light/50 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs text-gray-400 p-4">{t("admin.branches.name")}</th>
              <th className="text-left text-xs text-gray-400 p-4">{t("admin.branches.code")}</th>
              <th className="text-left text-xs text-gray-400 p-4">{t("admin.branches.city")}</th>
              <th className="text-left text-xs text-gray-400 p-4">{t("admin.common.status")}</th>
              <th className="text-right text-xs text-gray-400 p-4">{t("admin.actions.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(b => (
              <tr key={b._id} className="border-b border-white/5">
                <td className="p-4">{b.name}</td>
                <td className="p-4 text-sm">{b.code}</td>
                <td className="p-4 text-sm">{b.address?.city}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                    {b.isActive ? t("admin.common.active") : t("admin.common.inactive")}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/branches/${b._id}/edit`} className="p-2 text-gray-400 hover:text-white"><FaEdit /></Link>
                    <button onClick={() => handleDelete(b._id)} className="p-2 text-gray-400 hover:text-red-400"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchesList;
