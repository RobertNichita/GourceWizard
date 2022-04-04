import { AppBanner } from '../components/navigation/AppBanner';
import { Back } from '../components/navigation/Back';

export default function FailedRender(props) {
  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
        <Back></Back>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <div className="flex items-start justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
          <p className="my-2 text-5xl">Failed to render video</p>
          <p>There was an issue visualizing your repository. Please try again.</p>
          <div className="flex justify-between">
            <Back isNotFixed={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
