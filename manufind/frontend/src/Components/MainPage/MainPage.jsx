import usineImg from '../../assets/images/usine.jpg';
import SearchCard from '../searchCard/searchCard';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-container">
      <div className='search-card'>
        <SearchCard/>
      </div>
    </div>
  );
}

export default MainPage;