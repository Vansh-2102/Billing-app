import React, { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { deleteItem } from '../../Service/ItemService';
import toast from 'react-hot-toast';

const ItemList = () => {
    const { items = [], setItems } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteByItemId = async (itemId) => {
        try {
            const response = await deleteItem(itemId);
            if (response && (response.status === 200 || response.status === 204)) {
                const updatedItems = items.filter(item => item.itemId !== itemId);
                setItems(updatedItems);
                toast.success("Item deleted successfully");
            } else {
                toast.error("Unable to delete item");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete item");
        }
    };

    return (
        <div className="item-list-container" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="input-group mb-3">
                <input
                    type="text"
                    name="keyword"
                    id="keyword"
                    placeholder='Search by keyword'
                    className='form-control'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
                <span className='input-group-text bg-warning'>
                    <i className="bi bi-search"></i>
                </span>
            </div>

            <div className="row g-3 pe-2">
                {filteredItems.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info">No items found</div>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item.itemId ?? item.id} className="col-12">
                            <div className="card p-3">
                                <div className="d-flex align-items-center">
                                    <div style={{ marginRight: '15px' }}>
                                        <img
                                            src={item.imgUrl ?? item.img_url ?? item.imageUrl ?? 'https://placehold.co/64x64'}
                                            alt={item.name}
                                            style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1">{item.name}</h5>
                                        <p className="mb-1 text-muted">{item.description}</p>
                                        <p className="mb-0">
                                            <strong>Price:</strong> ₹{item.price?.toFixed(2) || '0.00'} | 
                                            <strong> Category:</strong> {item.categoryName || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteByItemId(item.itemId)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ItemList;
