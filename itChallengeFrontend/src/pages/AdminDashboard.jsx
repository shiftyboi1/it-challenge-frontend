import React from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function AdminDashboard() {
	return (
		<>
			<Navbar />
			<main className="container" style={{ padding: '40px 16px' }}>
				<h1>Admin Dashboard</h1>
				<p>Tu budú nástroje na správu používateľov a objednávok.</p>
			</main>
			<Footer />
		</>
	);
}
