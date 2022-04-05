import {AppBanner} from '../components/navigation/AppBanner';
import {Back} from '../components/navigation/Back';

export default function TimeoutRender(props) {
  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
        <Back></Back>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <div className="flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
          <p className="my-2 text-5xl">
            Visualization has exceeded time limit.
          </p>
          <p>
            As a mechanism to stop people from hogging our [potato] servers, we
            will not render your repository with the given parameters.
          </p>
          <p>
            It has taken too long to render. Please try again with different
            settings.
          </p>
          <div className="flex justify-between">
            <Back isNotFixed={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
