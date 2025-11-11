import './ManageUsers.css';
import UserForm from "../../Components/UserForm/UserForm";
import UserList from "../../Components/UserList/UserList";

const ManageUsers = () => {
    return(
          <div className="mc-page">             {/* root for this screen */}
      <div className="mc-inner">
        <div className="mc-left">
          <UserForm/>
        </div>

        <div className="mc-right">
            <UserList/>
        </div>
      </div>
    </div>
    )
}

export default ManageUsers;