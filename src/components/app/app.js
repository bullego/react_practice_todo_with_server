import React, {Component} from 'react';
import Header from '../header';
import Search from '../search';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import AddItem from '../add-item';
import {createDeal, getActualDeals, updateDealStatus, deleteCurrentDeal} from '../../api/api';
import './app.css';


export default class App extends Component {	
	state = {
		todoData: [],
		searchText: '',
		filter: 'all' // active | all(default) | done
	}

	componentDidMount() {
		//get actual deals and set to STATE from server
		this.getDeals()
	}

	getDeals = () => {
		//get actual deals and set to STATE from server
		getActualDeals().then(deals => 
			this.setState({
				todoData: deals
			})
		)
	}
	
	addNewDeal = (text) => {
		//create new deal-object
		const newDeal = {
			dealName: text,
			important: false,
			done: false
		}
		//added to server new deal-object and set actual deals to STATE from server
		createDeal(newDeal).then(() => this.getDeals())
	}

	deleteDeal = (id) => {
		deleteCurrentDeal(id).then(() => this.getDeals())
	};

	changeDealStatus = (deals, id, property) => {
		const dealToChange = deals.find(deal => deal.id === id);
		const changedDeal = {
			...dealToChange,
			[`${property}`]: !dealToChange[`${property}`]
		}
		//update deal property ('done' or 'important') and set updeted deals to STATE
		updateDealStatus(changedDeal, id).then(() => this.getDeals());
	}
	
	onToggleImportant = (id) => {
		this.changeDealStatus(this.state.todoData, id, 'important')
	}
	onToggleDone = (id) => {
		this.changeDealStatus(this.state.todoData, id, 'done')
	};

	search(dealsArr, searchText) {
		if(searchText.length === 0) {
			return dealsArr;
		}
		
		return dealsArr.filter((el) => {
			return el.dealName.indexOf(searchText) > -1;
		});
	};

	onSearchHandler = (text) => {
		this.setState({searchText: text});
	};

	filter(dealsArr, filterName) {
		switch(filterName) {
			case 'all':
				return dealsArr;
			case 'active':
				return dealsArr.filter((el) => !el.done);
			case 'done':
				return dealsArr.filter((el) => el.done);
			default:
				return dealsArr;
		}
	}

	onFilterHandler = (filterName) => {
		this.setState({filter: filterName});
	}

	render() {
		const {searchText, todoData, filter} = this.state;
		const visibleDeals = this.filter(this.search(todoData, searchText), filter);
		
		const doneCount = todoData.filter((el) => el.done === true).length;
		const todoCount = todoData.length - doneCount;

		return (
			<div className="app">
				<Header toDo={todoCount} done={doneCount} />

				<Search onSearchHandler={this.onSearchHandler}/>
				
				<ItemStatusFilter	filter={filter}
													onFilterHandler={this.onFilterHandler} />

				<TodoList todos={visibleDeals}
									onDeleted={this.deleteDeal}
									toggleImportant={this.onToggleImportant}
									toggleDone={this.onToggleDone} />

				<AddItem addNewDeal={this.addNewDeal}/>
			</div>
		);
	}
};