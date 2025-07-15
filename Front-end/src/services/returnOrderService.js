const API_BASE_URL = "http://localhost:9999/api";

class ReturnOrderService {
  // Lấy danh sách hóa đơn có thể trả hàng
  static async getBillsForReturn(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.shift_id) {
        queryParams.append("shift_id", params.shift_id);
      }

      if (params.date_filter) {
        queryParams.append("date_filter", params.date_filter);
      }

      if (params.time_slot) {
        queryParams.append("time_slot", params.time_slot);
      }

      const url = `${API_BASE_URL}/return/bills${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching bills for return:", error);
      throw error;
    }
  }

  // Lấy chi tiết hóa đơn để trả hàng
  static async getBillDetailsForReturn(billId) {
    try {
      const response = await fetch(`${API_BASE_URL}/return/bills/${billId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching bill details for return:", error);
      throw error;
    }
  }

  // Tạo yêu cầu trả hàng
  static async createReturnOrder(returnData) {
    try {
      const response = await fetch(`${API_BASE_URL}/return/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating return order:", error);
      throw error;
    }
  }

  // Lấy danh sách return orders đã tạo
  static async getReturnOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) {
        queryParams.append("page", params.page);
      }

      if (params.limit) {
        queryParams.append("limit", params.limit);
      }

      if (params.date_filter) {
        queryParams.append("date_filter", params.date_filter);
      }

      const url = `${API_BASE_URL}/return/${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching return orders:", error);
      throw error;
    }
  }

  // Lấy chi tiết return order
  static async getReturnOrderDetails(returnOrderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/return/${returnOrderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching return order details:", error);
      throw error;
    }
  }

  // Utility method to format date for API
  static formatDateForAPI(date) {
    return date.toISOString().split("T")[0];
  }

  // Utility method to check if order is in time slot
  static isOrderInTimeSlot(orderDate, timeSlot) {
    if (timeSlot === "Tất cả") return true;

    const date = new Date(orderDate);
    const hour = date.getHours();

    const [startHour, endHour] = timeSlot.split("h-").map((h) => parseInt(h));
    return hour >= startHour && hour < endHour;
  }

  // Utility method to check if order is in shift
  static isOrderInShift(orderDate, shift) {
    const date = new Date(orderDate);
    const hour = date.getHours();

    if (shift === "Ca sáng") {
      return hour >= 8 && hour < 15; // 8h-15h
    } else if (shift === "Ca chiều") {
      return hour >= 15 && hour < 22; // 15h-22h
    }
    return true; // Default show all
  }
}

export default ReturnOrderService;
