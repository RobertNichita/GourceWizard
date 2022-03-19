import {Button} from '../Button';
import {useNavigate} from 'react-router-dom';
export function Back(props) {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        className="fixed left-3 top-10 mt-7"
        title="Back 📖"
        onClick={() => {
          navigate('/library');
        }}
      ></Button>
      ;
    </div>
  );
}
