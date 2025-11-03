import React from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function ManagerDashboard() {
	return (
		<>
			<Navbar />
			<main className="container" style={{ padding: '40px 16px' }}>
				<h1>Správca Dashboard</h1>
				<p>Prehľad objednávok pre rolu SPRAVCA.</p>
			</main>
			<Footer />
		</>
	);
}
