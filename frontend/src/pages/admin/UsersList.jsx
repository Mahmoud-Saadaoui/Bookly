import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usersAdminAPI } from "../../api/endpoints";
import toast from "react-hot-toast";

const UsersList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersAdminAPI.getAll({ page: pagination.page, limit: pagination.limit });
      if (res.data.success) {
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch {
      toast.error(t("admin.common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-cairo font-bold mb-2">{t("admin.users.title")}</h1>
        <p className="text-gray-400">{t("admin.users.subtitle")}</p>
      </div>
      <div className="bg-dark-light/50 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs text-gray-400 p-4">{t("admin.common.name")}</th>
              <th className="text-left text-xs text-gray-400 p-4">{t("admin.common.email")}</th>
              <th className="text-left text-xs text-gray-400 p-4">{t("admin.common.role")}</th>
              <th className="text-left text-xs text-gray-400 p-4">{t("admin.common.status")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-white/5">
                <td className="p-4">{u.name}</td>
                <td className="p-4 text-sm">{u.email}</td>
                <td className="p-4 text-sm">{t(`admin.roles.${u.role}`, u.role)}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                    {u.isActive !== false ? t("admin.common.active") : t("admin.common.inactive")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
