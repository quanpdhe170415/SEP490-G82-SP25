import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, Plus, Edit2, Trash2, RotateCcw } from "lucide-react";
import CashierLayout from "./cashier/CashierLayout";
import ProductService from "../services/productService";

// Helper function định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

const ProductManagement = () => {
  // State cho dữ liệu từ API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 5,
  });

  // State cho filters, pagination và sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // NEW: State cho category search và infinite scroll
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(8);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const categoriesContainerRef = useRef(null);

  // State cho modal tạo/sửa sản phẩm
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalForm, setModalForm] = useState({
    goods_name: "",
    barcode: "",
    unit_of_measure: "",
    description: "",
    category_id: "",
    selling_price: "",
    average_import_price: "",
    stock_quantity: "",
    minimum_stock_quantity: "",
  });

  // Load dữ liệu từ API
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Add filters
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory && selectedCategory !== "Tất cả")
        params.category = selectedCategory;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;

      // Add sorting
      if (sortConfig.key) {
        params.sortBy = sortConfig.key;
        params.sortOrder =
          sortConfig.direction === "ascending" ? "asc" : "desc";
      }

      const response = await ProductService.getAllProducts(params);

      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Không thể tải danh sách sản phẩm");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setError(error.message || "Có lỗi xảy ra khi tải dữ liệu");
      setProducts([]);
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: itemsPerPage,
      });
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedCategory,
    priceRange,
    sortConfig,
  ]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await ProductService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  // Load data khi component mount và khi params thay đổi
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Tạo danh sách categories với "Tất cả"
  const allCategories = useMemo(() => {
    const categoryNames = categories.map((cat) => cat.name);
    return ["Tất cả", ...categoryNames.sort()];
  }, [categories]);

  // NEW: Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!categorySearchTerm.trim()) {
      return allCategories;
    }
    return allCategories.filter((category) =>
      category.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );
  }, [allCategories, categorySearchTerm]);

  // NEW: Get visible categories for infinite scroll
  const visibleCategories = useMemo(() => {
    return filteredCategories.slice(0, visibleCategoriesCount);
  }, [filteredCategories, visibleCategoriesCount]);

  // NEW: Load more categories function
  const loadMoreCategories = useCallback(() => {
    if (visibleCategoriesCount < filteredCategories.length) {
      setIsLoadingCategories(true);
      setTimeout(() => {
        setVisibleCategoriesCount((prev) =>
          Math.min(prev + 8, filteredCategories.length)
        );
        setIsLoadingCategories(false);
      }, 500); // Simulate loading delay
    }
  }, [visibleCategoriesCount, filteredCategories.length]);

  // NEW: Reset category filters - MOVED UP to fix initialization order
  const resetCategoryFilters = useCallback(() => {
    setCategorySearchTerm("");
    setVisibleCategoriesCount(8);
  }, []);

  // NEW: Handle category search
  const handleCategorySearch = useCallback((searchValue) => {
    setCategorySearchTerm(searchValue);
    setVisibleCategoriesCount(8); // Reset visible count when searching
  }, []);

  // NEW: Handle keyboard shortcuts for category search
  const handleCategorySearchKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        resetCategoryFilters();
        e.target.blur();
      }
    },
    [resetCategoryFilters]
  );

  // NEW: Scroll event handler for infinite scroll
  const handleCategoriesScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        loadMoreCategories();
      }
    },
    [loadMoreCategories]
  );

  // Reset visible categories count when search term changes
  useEffect(() => {
    setVisibleCategoriesCount(8);
  }, [categorySearchTerm]);

  // Products sẽ được filter, sort và paginate từ API, không cần local processing

  // Xử lý bộ lọc
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("Tất cả");
    setPriceRange({ min: "", max: "" });
    setSortConfig({ key: null, direction: "ascending" });
    setCurrentPage(1);
    resetCategoryFilters();
  }, [resetCategoryFilters]);

  // Xử lý tìm kiếm
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    // loadProducts sẽ được trigger bởi useEffect khi currentPage thay đổi
  }, []);

  // Hàm yêu cầu sắp xếp
  const requestSort = useCallback(
    (key) => {
      let direction = "ascending";
      // Nếu click lại vào cột đang được sắp xếp, đổi chiều
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
      setCurrentPage(1); // Quay về trang đầu tiên khi sắp xếp
    },
    [sortConfig]
  );

  // Enhanced category selection
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1);

    // Scroll selected category into view if it's in the container
    if (categoriesContainerRef.current) {
      const activeButton = categoriesContainerRef.current.querySelector(
        ".list-group-item.active"
      );
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  }, []);

  // CRUD Functions
  const openCreateModal = useCallback(() => {
    setEditingProduct(null);
    setModalForm({
      goods_name: "",
      barcode: "",
      unit_of_measure: "",
      description: "",
      category_id: "",
      selling_price: "",
      average_import_price: "",
      stock_quantity: "",
      minimum_stock_quantity: "",
    });
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((product) => {
    setEditingProduct(product);
    setModalForm({
      goods_name: product.name,
      barcode: product.barcode || "",
      unit_of_measure: product.unit,
      description: product.description || "",
      category_id: product.category_id || "",
      selling_price: product.sellingPrice.toString(),
      average_import_price: product.costPrice.toString(),
      stock_quantity: product.stock.toString(),
      minimum_stock_quantity: product.minimum_stock_quantity?.toString() || "0",
    });
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingProduct(null);
    setModalForm({
      goods_name: "",
      barcode: "",
      unit_of_measure: "",
      description: "",
      category_id: "",
      selling_price: "",
      average_import_price: "",
      stock_quantity: "",
      minimum_stock_quantity: "",
    });
  }, []);

  const handleModalFormChange = useCallback((field, value) => {
    setModalForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCreateProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductService.createProduct(modalForm);
      if (response.success) {
        closeModal();
        await loadProducts(); // Reload products
        alert("Tạo sản phẩm thành công!");
      } else {
        throw new Error(response.message || "Không thể tạo sản phẩm");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [modalForm, loadProducts, closeModal]);

  const handleUpdateProduct = useCallback(async () => {
    if (!editingProduct) return;

    try {
      setLoading(true);
      const response = await ProductService.updateProduct(
        editingProduct.id,
        modalForm
      );
      if (response.success) {
        closeModal();
        await loadProducts(); // Reload products
        alert("Cập nhật sản phẩm thành công!");
      } else {
        throw new Error(response.message || "Không thể cập nhật sản phẩm");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [editingProduct, modalForm, loadProducts, closeModal]);

  const handleDeleteProduct = useCallback(
    async (productId) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

      try {
        setLoading(true);
        const response = await ProductService.deleteProduct(productId);
        if (response.success) {
          await loadProducts(); // Reload products
          alert("Xóa sản phẩm thành công!");
        } else {
          throw new Error(response.message || "Không thể xóa sản phẩm");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(`Lỗi: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [loadProducts]
  );

  // ADDED: Hàm để hiển thị icon sắp xếp
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return (
        <span className="text-muted ms-1" style={{ opacity: 0.5 }}>
          ↕
        </span>
      );
    }
    return (
      <span className="ms-1" style={{ color: "#0d6efd" }}>
        {sortConfig.direction === "ascending" ? "▲" : "▼"}
      </span>
    );
  };

  // Pagination - sử dụng data từ API
  const totalPages = pagination.total_pages;
  const currentProducts = products; // API đã trả về data đã được paginate

  const handlePageChange = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;
    pages.push(
      <li
        key="prev"
        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
      >
        {" "}
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Trang trước"
        >
          {" "}
          ‹{" "}
        </button>{" "}
      </li>
    );
    if (currentPage > 2) {
      pages.push(
        <li key={1} className="page-item">
          {" "}
          <button className="page-link" onClick={() => handlePageChange(1)}>
            {" "}
            1{" "}
          </button>{" "}
        </li>
      );
      if (currentPage > 3) {
        pages.push(
          <li key="dots1" className="page-item disabled">
            {" "}
            <span className="page-link">...</span>{" "}
          </li>
        );
      }
    }
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          {" "}
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {" "}
            {i}{" "}
          </button>{" "}
        </li>
      );
    }
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(
          <li key="dots2" className="page-item disabled">
            {" "}
            <span className="page-link">...</span>{" "}
          </li>
        );
      }
      pages.push(
        <li key={totalPages} className="page-item">
          {" "}
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            {" "}
            {totalPages}{" "}
          </button>{" "}
        </li>
      );
    }
    pages.push(
      <li
        key="next"
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        {" "}
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Trang sau"
        >
          {" "}
          ›{" "}
        </button>{" "}
      </li>
    );
    return pages;
  };

  return (
    <CashierLayout pageTitle="Quản lý sản phẩm" breadcrumb="Quản lý sản phẩm">
      <div>
        <div className="row g-4">
          {/* Left Panel - Categories */}
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-title mb-0">Nhóm sản phẩm</h6>
                  <button className="btn btn-sm btn-success">
                    <Plus size={16} className="me-1" /> Thêm
                  </button>
                </div>

                {/* Category Search Input */}
                <div className="mb-3">
                  <div
                    className="d-grid mb-3"
                    style={{
                      gridTemplateColumns: "1fr auto",
                      gap: "0",
                      maxWidth: "100%",
                    }}
                  >
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Tìm kiếm nhóm sản phẩm..."
                      value={categorySearchTerm}
                      onChange={(e) => handleCategorySearch(e.target.value)}
                      onKeyDown={handleCategorySearchKeyDown}
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        fontSize: "0.875rem",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        margin: 0,
                        // Thêm các thuộc tính sau để đồng bộ kích thước
                        height: "28px",
                        fontSize: "0.8rem",
                        padding: "0.2rem 0.5rem",
                      }}
                    />
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={resetCategoryFilters}
                      type="button"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        fontSize: "0.875rem",
                        padding: "0.25rem 0.5rem",
                      }}
                      title="Xóa bộ lọc nhóm sản phẩm"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>

                {/* Categories List with Infinite Scroll */}
                <div
                  className="list-group list-group-flush"
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                    border: "1px solid #dee2e6",
                    borderRadius: "0.375rem",
                    backgroundColor: "#f8f9fa",
                  }}
                  onScroll={handleCategoriesScroll}
                  ref={categoriesContainerRef}
                >
                  {visibleCategories.length > 0 ? (
                    <>
                      {visibleCategories.map((category) => (
                        <button
                          key={category}
                          className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                            selectedCategory === category ? "active" : ""
                          }`}
                          onClick={() => handleCategorySelect(category)}
                          style={{
                            transition: "all 0.2s ease",
                            borderRadius: "0.25rem",
                            margin: "2px",
                            backgroundColor:
                              selectedCategory === category
                                ? "#0d6efd"
                                : "#ffffff",
                            color:
                              selectedCategory === category
                                ? "#ffffff"
                                : "#212529",
                          }}
                          onMouseEnter={(e) => {
                            if (selectedCategory !== category) {
                              e.target.style.backgroundColor = "#e3f2fd";
                              e.target.style.transform = "translateX(2px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedCategory !== category) {
                              e.target.style.backgroundColor = "#ffffff";
                              e.target.style.transform = "translateX(0px)";
                            }
                          }}
                        >
                          <span className="small">{category}</span>
                        </button>
                      ))}

                      {/* Loading Indicator */}
                      {isLoadingCategories && (
                        <div
                          className="list-group-item text-center py-3"
                          style={{
                            backgroundColor: "#fff3cd",
                            border: "1px solid #ffeaa7",
                            borderRadius: "0.25rem",
                            margin: "2px",
                          }}
                        >
                          <div
                            className="spinner-border spinner-border-sm text-primary me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span className="small text-muted">
                            Đang tải thêm...
                          </span>
                        </div>
                      )}

                      {/* Load More Button */}
                      {!isLoadingCategories &&
                        visibleCategoriesCount < filteredCategories.length && (
                          <button
                            className="list-group-item list-group-item-action text-center py-2 text-primary"
                            onClick={loadMoreCategories}
                            style={{
                              fontSize: "0.875rem",
                              borderRadius: "0.25rem",
                              margin: "2px",
                              backgroundColor: "#e3f2fd",
                              border: "1px dashed #2196f3",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#bbdefb";
                              e.target.style.transform = "scale(1.02)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "#e3f2fd";
                              e.target.style.transform = "scale(1)";
                            }}
                          >
                            <Plus size={16} className="me-1" />
                            Xem thêm
                          </button>
                        )}
                    </>
                  ) : (
                    <div
                      className="list-group-item text-center py-4 text-muted"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "2px dashed #dee2e6",
                        borderRadius: "0.25rem",
                        margin: "2px",
                      }}
                    >
                      <Search size={24} className="mb-2 opacity-50" />
                      <div className="small">
                        {categorySearchTerm
                          ? `Không tìm thấy nhóm sản phẩm "${categorySearchTerm}"`
                          : "Không có nhóm sản phẩm nào"}
                      </div>
                      {categorySearchTerm && (
                        <button
                          className="btn btn-sm btn-outline-primary mt-2"
                          onClick={resetCategoryFilters}
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Right Panel - Products List */}
          <div className="col-md-9">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-title mb-0">
                    Danh sách sản phẩm{" "}
                    <span className="badge bg-primary ms-2">
                      {pagination.total_items}
                    </span>
                  </h6>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={resetFilters}
                    >
                      <RotateCcw size={16} className="me-1" /> Xóa bộ lọc
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={openCreateModal}
                    >
                      <Plus size={16} className="me-1" /> Thêm sản phẩm
                    </button>
                  </div>
                </div>
                {/* Filters */}
                <div className="mb-3">
                  {/* Search */}
                  <div className="mb-3">
                    <div
                      className="d-grid"
                      style={{
                        gridTemplateColumns: "1fr auto",
                        gap: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên sản phẩm hoặc mã sản phẩm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          margin: 0,
                          height: "32px",
                          fontSize: "0.9rem",
                          padding: "0.375rem 0.75rem",
                        }}
                      />
                      <button
                        className="btn btn-secondary"
                        onClick={handleSearch}
                        type="button"
                        style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          margin: 0,
                          height: "32px",
                          fontSize: "0.9rem",
                          padding: "0.375rem 0.75rem",
                        }}
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>
                  {/* Price Range Filter */}
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label text-muted small">
                        Khoảng giá:
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Từ"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              min: e.target.value,
                            }))
                          }
                          min="0"
                        />
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Đến"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              max: e.target.value,
                            }))
                          }
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Loading State */}
                {loading && (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <div className="mt-2">Đang tải dữ liệu...</div>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Lỗi:</strong> {error}
                    <button
                      className="btn btn-sm btn-outline-danger ms-3"
                      onClick={loadProducts}
                    >
                      Thử lại
                    </button>
                  </div>
                )}

                {/* Products Table */}
                {!loading && !error && (
                  <div className="table-responsive">
                    <table
                      className="table table-sm table-hover"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderBottom: "2px solid #dee2e6",
                        }}
                      >
                        <tr className="align-middle text-center">
                          {/* CHANGED: Thêm onClick, style và hiển thị icon sắp xếp */}
                          <th
                            className="text-start text-muted small text-uppercase user-select-none"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              borderBottom: "2px solid transparent",
                              padding: "12px 16px",
                              fontWeight: "600",
                              fontSize: "0.75rem",
                              color: "#6c757d",
                            }}
                            onClick={() => requestSort("name")}
                            title="Nhấn để sắp xếp theo tên sản phẩm"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#e9ecef";
                              e.target.style.borderBottomColor = "#0d6efd";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "";
                              e.target.style.borderBottomColor = "transparent";
                            }}
                          >
                            TÊN SAN PHẨM{getSortIndicator("name")}
                          </th>
                          <th
                            className="text-muted small text-uppercase user-select-none"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              borderBottom: "2px solid transparent",
                              padding: "12px 16px",
                              fontWeight: "600",
                              fontSize: "0.75rem",
                              color: "#6c757d",
                            }}
                            onClick={() => requestSort("category")}
                            title="Nhấn để sắp xếp theo nhóm hàng"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#e9ecef";
                              e.target.style.borderBottomColor = "#0d6efd";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "";
                              e.target.style.borderBottomColor = "transparent";
                            }}
                          >
                            NHÓM HÀNG{getSortIndicator("category")}
                          </th>
                          <th
                            className="text-muted small text-uppercase user-select-none"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              borderBottom: "2px solid transparent",
                              padding: "12px 16px",
                              fontWeight: "600",
                              fontSize: "0.75rem",
                              color: "#6c757d",
                            }}
                            onClick={() => requestSort("sellingPrice")}
                            title="Nhấn để sắp xếp theo giá bán"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#e9ecef";
                              e.target.style.borderBottomColor = "#0d6efd";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "";
                              e.target.style.borderBottomColor = "transparent";
                            }}
                          >
                            GIÁ BÁN{getSortIndicator("sellingPrice")}
                          </th>
                          <th
                            className="text-muted small text-uppercase user-select-none"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              borderBottom: "2px solid transparent",
                              padding: "12px 16px",
                              fontWeight: "600",
                              fontSize: "0.75rem",
                              color: "#6c757d",
                            }}
                            onClick={() => requestSort("costPrice")}
                            title="Nhấn để sắp xếp theo giá vốn"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#e9ecef";
                              e.target.style.borderBottomColor = "#0d6efd";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "";
                              e.target.style.borderBottomColor = "transparent";
                            }}
                          >
                            GIÁ VỐN TB{getSortIndicator("costPrice")}
                          </th>
                          <th
                            className="text-muted small text-uppercase user-select-none"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              borderBottom: "2px solid transparent",
                              padding: "12px 16px",
                              fontWeight: "600",
                              fontSize: "0.75rem",
                              color: "#6c757d",
                            }}
                            onClick={() => requestSort("stock")}
                            title="Nhấn để sắp xếp theo số lượng tồn kho"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#e9ecef";
                              e.target.style.borderBottomColor = "#0d6efd";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "";
                              e.target.style.borderBottomColor = "transparent";
                            }}
                          >
                            TỒN KHO{getSortIndicator("stock")}
                          </th>
                          <th
                            className="text-muted small text-uppercase"
                            style={{
                              padding: "12px 16px",
                              fontWeight: "600",
                              fontSize: "0.75rem",
                              color: "#6c757d",
                            }}
                          >
                            HÀNH ĐỘNG
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentProducts.length > 0 ? (
                          currentProducts.map((product, index) => (
                            <tr
                              key={product.id}
                              className="align-middle"
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "white" : "#f8f9fa",
                                borderBottom: "1px solid #dee2e6",
                              }}
                            >
                              <td style={{ padding: "12px 16px" }}>
                                <div
                                  className="fw-bold small"
                                  style={{
                                    color: "#212529",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {product.name}
                                </div>
                                <div
                                  className="text-muted small"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {product.id}
                                </div>
                              </td>
                              <td
                                className="text-center small"
                                style={{
                                  padding: "12px 16px",
                                  fontSize: "0.875rem",
                                  color: "#6c757d",
                                }}
                              >
                                {product.category}
                              </td>
                              <td
                                className="text-center text-danger fw-bold small"
                                style={{
                                  padding: "12px 16px",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {formatCurrency(product.sellingPrice)}
                              </td>
                              <td
                                className="text-center small"
                                style={{
                                  padding: "12px 16px",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {formatCurrency(product.costPrice)}
                              </td>
                              <td
                                className="text-center fw-bold small"
                                style={{
                                  padding: "12px 16px",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {product.stock}{" "}
                                <span className="text-muted">
                                  {product.unit}
                                </span>
                              </td>
                              <td
                                className="text-center"
                                style={{ padding: "12px 16px" }}
                              >
                                <div className="d-flex justify-content-center gap-1">
                                  <button
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#e3f2fd",
                                      color: "#1976d2",
                                      border: "1px solid #bbdefb",
                                      borderRadius: "4px",
                                      padding: "4px 8px",
                                    }}
                                    title="Sửa"
                                    onClick={() => openEditModal(product)}
                                    disabled={loading}
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: "#ffebee",
                                      color: "#d32f2f",
                                      border: "1px solid #ffcdd2",
                                      borderRadius: "4px",
                                      padding: "4px 8px",
                                    }}
                                    title="Xóa"
                                    onClick={() =>
                                      handleDeleteProduct(product.id)
                                    }
                                    disabled={loading}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center text-muted py-4"
                            >
                              <Search size={48} className="mb-3 opacity-50" />
                              <p className="mb-0">
                                Không tìm thấy sản phẩm nào
                              </p>
                              <p className="small">
                                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {!loading && !error && pagination.total_items > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small">Hiển thị:</span>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: "auto", minWidth: "70px" }}
                          value={itemsPerPage}
                          onChange={(e) =>
                            handleItemsPerPageChange(parseInt(e.target.value))
                          }
                        >
                          {" "}
                          <option value={5}>5</option>{" "}
                          <option value={10}>10</option>{" "}
                          <option value={15}>15</option>{" "}
                          <option value={20}>20</option>{" "}
                        </select>
                        <span className="text-muted small">sản phẩm/trang</span>
                      </div>
                      <div className="text-muted small">
                        Tổng: {pagination.total_items} sản phẩm
                      </div>
                    </div>
                    {totalPages > 1 ? (
                      <>
                        <nav aria-label="Phân trang sản phẩm">
                          {" "}
                          <ul className="pagination pagination-sm justify-content-center mb-2">
                            {renderPagination()}
                          </ul>{" "}
                        </nav>
                        <div className="text-center text-muted small">
                          {" "}
                          Trang {currentPage} / {totalPages} - Tổng:{" "}
                          {pagination.total_items} sản phẩm{" "}
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-muted small">
                        Hiển thị tất cả {pagination.total_items} sản phẩm
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal tạo/sửa sản phẩm */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={closeModal}
            style={{ zIndex: 1040 }}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              zIndex: 1050,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              className="modal-dialog modal-lg"
              style={{ margin: 0, maxWidth: "800px", width: "90%" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Tên sản phẩm *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={modalForm.goods_name}
                          onChange={(e) =>
                            handleModalFormChange("goods_name", e.target.value)
                          }
                          placeholder="Nhập tên sản phẩm"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Mã vạch *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={modalForm.barcode}
                          onChange={(e) =>
                            handleModalFormChange("barcode", e.target.value)
                          }
                          placeholder="Nhập mã vạch"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Đơn vị tính *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={modalForm.unit_of_measure}
                          onChange={(e) =>
                            handleModalFormChange(
                              "unit_of_measure",
                              e.target.value
                            )
                          }
                          placeholder="VD: cái, hộp, kg, lít"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Danh mục</label>
                        <select
                          className="form-control"
                          value={modalForm.category_id}
                          onChange={(e) =>
                            handleModalFormChange("category_id", e.target.value)
                          }
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Giá bán *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={modalForm.selling_price}
                          onChange={(e) =>
                            handleModalFormChange(
                              "selling_price",
                              e.target.value
                            )
                          }
                          placeholder="Nhập giá bán"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Giá vốn</label>
                        <input
                          type="number"
                          className="form-control"
                          value={modalForm.average_import_price}
                          onChange={(e) =>
                            handleModalFormChange(
                              "average_import_price",
                              e.target.value
                            )
                          }
                          placeholder="Nhập giá vốn"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Số lượng tồn kho</label>
                        <input
                          type="number"
                          className="form-control"
                          value={modalForm.stock_quantity}
                          onChange={(e) =>
                            handleModalFormChange(
                              "stock_quantity",
                              e.target.value
                            )
                          }
                          placeholder="Nhập số lượng"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Tồn kho tối thiểu</label>
                        <input
                          type="number"
                          className="form-control"
                          value={modalForm.minimum_stock_quantity}
                          onChange={(e) =>
                            handleModalFormChange(
                              "minimum_stock_quantity",
                              e.target.value
                            )
                          }
                          placeholder="Nhập tồn kho tối thiểu"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">Mô tả</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={modalForm.description}
                          onChange={(e) =>
                            handleModalFormChange("description", e.target.value)
                          }
                          placeholder="Nhập mô tả sản phẩm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={
                      editingProduct ? handleUpdateProduct : handleCreateProduct
                    }
                    disabled={
                      loading ||
                      !modalForm.goods_name ||
                      !modalForm.barcode ||
                      !modalForm.unit_of_measure ||
                      !modalForm.selling_price
                    }
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Đang xử lý...
                      </>
                    ) : editingProduct ? (
                      "Cập nhật"
                    ) : (
                      "Tạo mới"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </CashierLayout>
  );
};

export default ProductManagement;
