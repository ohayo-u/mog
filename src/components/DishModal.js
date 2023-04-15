import { deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { Food } from "./Food";
import { RegisterModal } from "./RegisterModal";
import { deleteObject, ref } from "firebase/storage";

export function DishModal ({dish, user, setIsModalOpen, setIsDishModalOpen, imgURL }) {
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [usedFood, setUsedFood] = useState([]);
  
  const dishDocRef = doc(db, 'users', user.uid, 'dish-list', dish.id);
  
  useEffect(() => {
    const unsub = onSnapshot(dishDocRef, (dishDocSnapshot) => {
      const usedFoodId = dishDocSnapshot.data().usedFoodId;
      Promise.all(usedFoodId.map(async (foodId) => {
        const usedFoodDocRef = doc(db, 'food', foodId);
        const usedFoodDocSnapshot = await getDoc(usedFoodDocRef);
        return { id: foodId, name: usedFoodDocSnapshot.data().name};
      })).then((usedFoodDocs) => setUsedFood(usedFoodDocs));
    });

  return unsub;
    
  }, []);

  const deleteDish = () => {
    setIsDishModalOpen(false);
    
    if(dish.imageURL !== undefined) {
      const dishImageRef = ref(storage, dish.imageURL)
      deleteObject(dishImageRef).then(() => {
        deleteDoc(dishDocRef);
      });
    } else {
      deleteDoc(dishDocRef);
    }
  };

  const modal = isModifyModalOpen ? (
    <RegisterModal 
      setIsModalOpen={setIsModalOpen}
      setIsModifyModalOpen={setIsModifyModalOpen}
      user={user}
      defaultDish={dish}
      usedFood={usedFood}
      isNewRegistration={false}
      />
  ) : (null);

  return (
    <>
      <div className="modal" onClick={() => setIsDishModalOpen(false)}></div>
      <div className="modal-inner">  
        <img src={imgURL ? imgURL : undefined} />
        <h1>{dish.name}</h1>
        <h2 className="section-title">この料理で使った食材</h2>
        {usedFood.map((food) => (
          <Food
            key={food.id}
            food={food}
            user={user}
          /> 
        ))}
        <div className="del-and-mod-btn">
          <button className="delete-btn" onClick={() => deleteDish()}>削除</button>
          <button className="modify-btn" onClick={() => setIsModifyModalOpen(true)}>修正</button>
        </div>
        <button
          className='modal-close-btn'
          onClick={() => setIsDishModalOpen(false)}
          >
          ×
        </button>
      </div>
      {modal}
    </>
  );
};

