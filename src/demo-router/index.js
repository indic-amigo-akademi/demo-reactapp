import React from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history';

// parse url params
function parseUrlParams(search) {
	const hashes = search.slice(search.indexOf('?') + 1).split('&');
	const params = hashes.reduce((prev, curr) => {
		const [key, val] = curr.split('=');
		const newObj = prev;
		newObj[key] = decodeURIComponent(val);
		return newObj;
	}, {});
	return params;
}

// Url join function
function joinUrl(...args) {
	const joined = args.join('/');
	return joined.replace(/\/\//g, '/');
}

// String left trim
function ltrim(str, chars) {
	chars = chars || '\\s';
	return str.replace(new RegExp('^[' + chars + ']+', 'g'), '');
}

function locationToRoute({ location }) {
	return {
		path: location.pathname,
		hash: location.hash,
		query: location.search.length > 0 ? parseUrlParams(location.search) : {},
	};
}

const history = createBrowserHistory();
const RouterContext = React.createContext({
	basename: '/',
	typename: '/',
	route: locationToRoute(history),
});

// Router Provider Component
const RouterProvider = ({ basename, children, typename }) => {
	const [route, setRoute] = React.useState(locationToRoute(history));

	const handleRouteChange = (location) => {
		setRoute(locationToRoute(location));
	};

	React.useLayoutEffect(() => {
		let unlisten = history.listen(handleRouteChange);
		return () => {
			unlisten();
		};
	}, []);

	return <RouterContext.Provider value={{ basename, typename, route }}>{children}</RouterContext.Provider>;
};

RouterProvider.propTypes = {
	basename: PropTypes.string,
	typename: PropTypes.string,
	children: PropTypes.node,
};

RouterProvider.defaultProps = {
	basename: '/',
	typename: '/',
};

// BrowserRouter Component
const BrowserRouterProvider = ({ basename, children }) => {
	return (
		<RouterProvider basename={basename} typename="/">
			{children}
		</RouterProvider>
	);
};

// HashRouter Component
const HashRouterProvider = ({ basename, children }) => {
	if (window.location.hash.length <= 0) {
		window.location.href = joinUrl(basename, '#/');
	}
	return (
		<RouterProvider basename={basename} typename="#">
			{children}
		</RouterProvider>
	);
};

const useRouter = () => React.useContext(RouterContext);

// Route Component
function Route({ path, exact, element, index, children }) {
	const { basename, route, typename } = React.useContext(RouterContext);

	let routeUrl = '',
		locationUrl = '';
	if (typename === '#' || typename === '#/') {
		const newTypename = '/';
		if (index) routeUrl = ltrim(joinUrl(basename, '/#/'), newTypename);
		else routeUrl = ltrim(joinUrl(basename, '/#/', path), newTypename);
		locationUrl = ltrim(joinUrl(basename, route.hash), newTypename);
	} else {
		if (index) routeUrl = ltrim(joinUrl(basename, ''), typename);
		else routeUrl = ltrim(joinUrl(basename, path), typename);
		locationUrl = ltrim(route.path, typename);
	}

	if ((!exact && !locationUrl.startsWith(routeUrl)) || (!!exact && locationUrl !== routeUrl)) {
		return null;
	}

	if (element) return <>{element}</>;
	return <>{children}</>;
}

Route.propTypes = {
	path: PropTypes.string,
	exact: PropTypes.bool,
	element: PropTypes.element,
	children: PropTypes.element,
};

// Link Component
function Link({ to, children, onClick, ...otherProps }) {
	const { basename, typename, route } = React.useContext(RouterContext);

	const handleClick = (e) => {
		e.preventDefault();
		let baseTo = '',
			locationUrl = '';
		if (typename === '#' || typename === '#/') {
			baseTo = joinUrl('#', to);
			locationUrl = route.hash;
		} else {
			baseTo = joinUrl(basename, to);
			locationUrl = route.path;
		}
		if (locationUrl === baseTo) {
			// If it's not a valid path function will not trigger.
			return;
		}
		if (onClick) {
			onClick(e);
		}
		history.push(baseTo);
	};

	return (
		<>
			<a {...otherProps} onClick={handleClick}>
				{children}
			</a>
		</>
	);
}

export {
	RouterProvider,
	BrowserRouterProvider,
	HashRouterProvider,
	parseUrlParams,
	locationToRoute,
	history,
	useRouter,
	Route,
	Link,
};
