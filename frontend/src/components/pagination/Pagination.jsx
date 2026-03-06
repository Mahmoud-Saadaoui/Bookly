import ReactPaginate from 'react-paginate';
import './pagination.css';

/**
 * Modern Pagination Component
 * Professional pagination with smart page display logic
 *
 * @param {Object} props - Component props
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.currentPage - Current active page (0-indexed)
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {string} props.containerClassName - Additional CSS class for container
 */
const Pagination = ({
  totalPages = 0,
  currentPage = 0,
  onPageChange,
  containerClassName = ''
}) => {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  // Smart configuration based on total pages
  // - For few pages: show more pages around current
  // - For many pages: show fewer pages with breaks
  const getPageRangeDisplayed = () => {
    if (totalPages <= 7) return totalPages; // Show all pages if 7 or fewer
    if (totalPages <= 15) return 3; // Show 3 pages around current for medium sets
    return 2; // Show 2 pages around current for large sets
  };

  const getMarginPagesDisplayed = () => {
    if (totalPages <= 7) return 0; // No margin needed for small sets
    return 1; // Show first and last page for larger sets
  };

  return (
    <nav className={`pagination-nav ${containerClassName}`} aria-label="Navigation de pagination">
      <ReactPaginate
        breakLabel={
          <span className="break-dots">•••</span>
        }
        nextLabel={
          <span className="nav-label">
            Suivant <span className="nav-arrow">→</span>
          </span>
        }
        onPageChange={onPageChange}
        pageRangeDisplayed={getPageRangeDisplayed()}
        pageCount={totalPages}
        marginPagesDisplayed={getMarginPagesDisplayed()}
        previousLabel={
          <span className="nav-label">
            <span className="nav-arrow">←</span> Précédent
          </span>
        }
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        nextClassName="page-item next"
        nextLinkClassName="page-link"
        previousClassName="page-item previous"
        previousLinkClassName="page-link"
        breakClassName="page-item break"
        breakLinkClassName="page-link"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        activeClassName="page-item active"
        disabledClassName="page-item disabled"
        activeLinkClassName="active-link"
        forcePage={currentPage}
        // Accessibility improvements
        hrefBuilder={(pageIndex, pageSize, pageCount) => {
          return `#page-${pageIndex + 1}`;
        }}
        hrefAllControls
        // Smooth scroll behavior
        onClick={(clickEvent) => {
          // Optional: Add custom click handling
        }}
      />
    </nav>
  );
};

export default Pagination;
