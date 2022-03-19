import {Button} from '../components/Button';
import {useNavigate, useLocation} from 'react-router-dom';
import {AppBanner} from '../components/navigation/AppBanner';

interface VideoState {
  title: string;
}

export default function library() {
  const navigate = useNavigate();
  const location = useLocation();
  const {title} = location.state as VideoState;

  return <div>{title}</div>;
}
