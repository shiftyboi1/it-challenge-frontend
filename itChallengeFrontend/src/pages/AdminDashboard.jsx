import React from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import UsersTable from '../components/tables/UsersTable';

export default function AdminDashboard() {
	return (
		<>
			<Navbar />
			<main className="container" style={{ padding: '40px 16px' }}>
				<h1>Admin Dashboard</h1>
				<section style={{ marginTop: 24 }}>
					<h2>Používatelia</h2>
					<UsersTable />
				</section>
			</main>
		</>
	);
}
