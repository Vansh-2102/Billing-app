import ItemForm from '../../Components/ItemForm/ItemForm';
import ItemList from '../../Components/ItemList/ItemList';

import './ManageItems.css'; 
const ManageItems = () => {
    return(
       <div className="mc-page">             {/* root for this screen */}
      <div className="mc-inner">
        <div className="mc-left">
          <ItemForm />
        </div>

        <div className="mc-right">
          <ItemList />
        </div>
      </div>
    </div>
    )
}

export default ManageItems;