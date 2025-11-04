import React from 'react';
import Navbar from '../components/navbar/Navbar';
import OrdersTable from '../components/tables/OrdersTable';

export default function ManagerDashboard() {
	return (
		<>
			<Navbar />
			<main className="container" style={{ padding: '40px 16px' }}>
				<h1>Manager Dashboard</h1>
				<p>Prehľad a správa objednávok.</p>
				<OrdersTable />
			</main>
		</>
	);
}
