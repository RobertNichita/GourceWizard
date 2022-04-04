import {Button} from '../Button';
import {useNavigate} from 'react-router-dom';

export function Back(props) {
  const navigate = useNavigate();
  const {isNotFixed} = props;

  const className = isNotFixed ? "left-3 top-10 mt-7" : "fixed left-3 top-10 mt-7"

  return (
    <div>
      <Button
        className={className}
        title="Back 📖"
        onClick={() => {
          navigate('/library');
        }}
      ></Button>
    </div>
  );
}
