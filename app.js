//SECTION --- Storage Controller ---

//SECTION --- Item Controller ---
const ItemCtrl = (function () {
  //item Contructor 
  const Item = function (id, name, calories) {
    this.id = id,
      this.name = name,
      this.calories = calories
  }

  //Data Structure / State
  const data = {
    items: [
      // {id:0, name: 'Steak Dinner', calories: 1200},
      // {id:0, name: 'Cookie', calories: 400},
      // {id:0, name: 'Eggs', calories: 300},
    ],
    currentItem: null,
    totalCalories: 0
  }
  //public methods 
  return {
    getItems: function () {
      return data.items
    },

    addItem: function (name, calories) {
      let id = 0
      //create id
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1
      } else {
        id = 0
      }
      //calories to number 
      calories = parseInt(calories)

      //create new item
      // newItem = new Item(id,name,calories)
      newItem = new Object({ id, name, calories })
      //add to new items array

      data.items.push(newItem)

      return newItem
    },

    getItemById: function (id) {
      let found = null
      //loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item
        }
      })
      return found
    },

    updateItem:function(name, calories) {
      //calories to number
      calories = parseInt(calories)

      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item
        }
      })
      return found
    },
    deleteItem(id){
      //get ids 
     const ids = data.items.map(function(item){
        return item.id  
      })
      //get index 
      const index = ids.indexOf(id);
      
      //remove item 
      data.items.splice(index, 1)
    },

    clearAllItems:function () {
      data.items = []
    },

    setCurrentItem: function (item) {
      data.currentItem = item
    },

    getCurrentItem: function () {
      return data.currentItem
    },

    getTotalCalories: function () {
      let total = 0

      //loop items and add cals
      data.items.forEach(function (item) {
        total += item.calories
      })

      //set total calories in data structure
      data.totalCalories = total

      //return total
      return data.totalCalories
    },

    logData: function () {
      return data
    }
  }
}())



//SECTION ---UI Controller  ---

const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems:'#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn:'.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'

  }

  //public mehtods 
  return {
    populateItemList: function (items) {
      let html = ''
      items.forEach(function (item) {
        html += ` 
        <li id="item-${item.id}" class="collection-item"">
          <strong>${item.name}</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i></a>
        </li>`
      })

      // insert li items
      document.querySelector(UISelectors.itemList).innerHTML = html
    },

    getItemInPut: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },

    addListItem: function (item) {
      //show the list 
      document.querySelector(UISelectors.itemList).style.display = 'block'
      //create li element 
      const li = document.createElement('li')
      //add class
      li.className = 'collection-item'
      // Add ID
      li.id = `item-${item.id}`
      //add html
      li.innerHTML = `
       <strong>${this.capitalizeFirstLetter(item.name)}</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i></a>
      `
    //insert item 
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },

    updateListItem:function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems)

      //convert nodelist(from listItems) into array
      listItems = Array.from(listItems)

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id')
      

        if(itemID === `item-${item.id}`){
         
          document.querySelector(`#${itemID}`).innerHTML = `
           <strong>${UICtrl.capitalizeFirstLetter(item.name)}</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i></a>`
        }
      })
    },

    deleteListItem:function(id){
      const itemID = `#item-${id}`
      const item = document.querySelector(itemID)
      item.remove()
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = ''
      document.querySelector(UISelectors.itemCaloriesInput).value = ''
    },

    addItemToForm: function () {
      const captFirstLetterName = this.capitalizeFirstLetter(ItemCtrl.getCurrentItem().name)
      document.querySelector(UISelectors.itemNameInput).value = captFirstLetterName
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories

      UICtrl.showEditState()
    },

    removeItems:function () {
      let listitems = document.querySelectorAll(UISelectors.listItems)

      //turn node into array 
      listitems = Array.from(listitems);
      listitems.forEach(function(item){
        item.remove()
      })
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },
    clearEditState: function () {
      UICtrl.clearInput()

      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
    },

    clearEditStateBackBtn:function(){
      UICtrl.clearInput()
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },

    showEditState: function () {
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },
    getSelectors: function () {
      return UISelectors
    },
    capitalizeFirstLetter: function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }

  }

}())


//SECTION --- App Controller ---

const App = (function (ItemCtrl, UICtrl) {
  // load Event listeners 
  const loadEventListeners = function () {
    // Get UI Selectors 
    const UISelectors = UICtrl.getSelectors()

    //add item event 
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

    // edit icon click event 
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

    // disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault()
        return false
      }
    })

    //update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

    //delte item event 
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

    // back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditStateBackBtn)

    //clear items
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
  }

  // add item submit
  const itemAddSubmit = function (e) {
    // Get form input from ui controller
    const input = UICtrl.getItemInPut()

    //check for name and calorie input
    if (input.name !== '' || input.calories !== '') {
      //add item
      const newItem = ItemCtrl.addItem(input.name, input.calories)
      //add item to UI list 
      UICtrl.addListItem(newItem)

      //get total calories 
      const totalCalories = ItemCtrl.getTotalCalories()

      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories)


      //clear fields 
      UICtrl.clearInput()
    }

    e.preventDefault()
  }

  //click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      //get list item ID
      const listId = e.target.parentNode.parentNode.id

      //break into an array
      const listIdArray = listId.split('-')

      //get the actual id
      const id = parseInt(listIdArray[1])

      //get item
      const itemToEdit = ItemCtrl.getItemById(id)

      //set current item 
      ItemCtrl.setCurrentItem(itemToEdit)

      //add item to form 
      UICtrl.addItemToForm()
    }
    e.preventDefault()
  }

  //update item submit 
  const itemUpdateSubmit = function (e) {
    // get item input 
    const input = UICtrl.getItemInPut();

    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

    //update UI
    UICtrl.updateListItem(updatedItem)

    //get total calories 
    const totalCalories = ItemCtrl.getTotalCalories()

    //add total calories to UI
    UICtrl.showTotalCalories(totalCalories)

    UICtrl.clearEditState()

    e.preventDefault()
  }

  //delete btn event
  const itemDeleteSubmit = function(e){
    //get current item 
    const currentItem = ItemCtrl.getCurrentItem()
    //delete from data structure 
    ItemCtrl.deleteItem(currentItem.id)
    //delte from ui 
    UICtrl.deleteListItem(currentItem.id)

    //get total calories 
    const totalCalories = ItemCtrl.getTotalCalories()
    //add total calories 
    UICtrl.showTotalCalories(totalCalories)
    //clear input 
    UICtrl.clearEditState()
    e.preventDefault()
  }
  
  //clear items event 
  const clearAllItemsClick = function(){
    //delete all items from data structure 
    ItemCtrl.clearAllItems()
    //get total calories 
    const totalCalories = ItemCtrl.getTotalCalories()
    //add total calories 
    UICtrl.showTotalCalories(totalCalories)
    // remove from UI
    UICtrl.removeItems()
    //hide UL
    UICtrl.hideList()
  }

  // public methods
  return {
    init: function () {
      //clear edit state /set init state
      UICtrl.clearEditState()
      //fetch items from data structure 
      const items = ItemCtrl.getItems()

      //check if any items 
      if (items.length === 0) {
        UICtrl.hideList()
      } else {
        //populate list with items
        UICtrl.populateItemList(items)
      }

      //get total calories 
      const totalCalories = ItemCtrl.getTotalCalories()

      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories)


      //load event listeners 
      loadEventListeners()
    }
  }

}(ItemCtrl, UICtrl))

//initalize App
App.init()
