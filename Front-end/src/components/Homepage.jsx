import React from "react";

const Homepage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-green-600 text-white py-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <h1 className="text-2xl font-bold">Groceries Store Management</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <a href="#dashboard" className="hover:underline">
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#inventory" className="hover:underline">
                                    Inventory
                                </a>
                            </li>
                            <li>
                                <a href="#sales" className="hover:underline">
                                    Sales
                                </a>
                            </li>
                            <li>
                                <a href="#reports" className="hover:underline">
                                    Reports
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <section className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome to Groceries Store Management
                    </h2>
                    <p className="text-gray-600">
                        Manage your store efficiently with our intuitive tools for inventory, sales, and reporting.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Inventory</h3>
                        <p className="text-gray-600 mb-4">
                            Keep track of your stock levels and manage your products with ease.
                        </p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Manage Inventory
                        </button>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Sales</h3>
                        <p className="text-gray-600 mb-4">
                            Monitor sales and analyze trends to grow your business.
                        </p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            View Sales
                        </button>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Reports</h3>
                        <p className="text-gray-600 mb-4">
                            Generate detailed reports to make informed decisions.
                        </p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Generate Reports
                        </button>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-4 mt-8">
                <div className="container mx-auto text-center">
                </div>
            </footer>
        </div>
    );
};

export default Homepage;