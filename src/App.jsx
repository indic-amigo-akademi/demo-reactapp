import React from 'react';
import { HashRouterProvider, Link, Route } from './demo-router';

function App() {
	return (
		<div className="App">
			<HashRouterProvider basename={process.env.PUBLIC_URL}>
				<header className="App-header">App Header</header>
				<nav style={{ padding: '10px' }}>
					<Link to="/">Home</Link> <br />
					<Link to="people">People</Link> <br />
					<Link to="people/1">People/1</Link> <br />
					<Link to="hello">Hello</Link>
				</nav>
				<main style={{ padding: '10px' }}>
					<Route index element={<h1>Hello Index!</h1>} />
					<Route exact path="people">
						<h1>Hello People</h1>
					</Route>
					<Route exact path="people/1">
						<h1>Hello People_1</h1>
					</Route>
					{/* <Route exact path="people">
						<h1>People</h1>
					</Route> */}
					<Route exact path="hello">
						<h1>Hello Hello</h1>
					</Route>
				</main>
				<footer className="App-footer">App Footer</footer>
			</HashRouterProvider>
		</div>
	);
}

export default App;
