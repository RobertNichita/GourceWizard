import {Component} from 'react';
import {useLocation} from 'react-router-dom';
import {setError} from './components/navigation/AppBanner';
import {useEffect} from 'react';

function Container(props) {
  const location = useLocation();

  useEffect(() => {
    setError('error', {title: undefined, description: undefined});
  }, [location]);

  return <div>{props.children}</div>;
}
export default Container;
