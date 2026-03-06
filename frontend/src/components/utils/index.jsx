export const categories = [
  "Historical Fiction",
  "Mystery",
  "Fantasy",
  "Romance",
  "Human Development",
  "Social",
  "Drame",
  "History",
];

export const InputField = ({ type, placeholder, ...props }) => (
  <input
    type={type}
    className="book-modal-input"
    placeholder={placeholder}
    {...props}
  />
);

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0'); 
  return `${year}-${month}-${day}`;
}
