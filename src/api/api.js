//you should get temporary API_KEY_TEMP from service https://crudcrud.com/
const API_KEY_TEMP = 'd89c007b34df4e9db7a8e2eb11e8ffa9';
const baseUrl = `https://crudcrud.com/api/${API_KEY_TEMP}/deals`;

export const createDeal = (newDeal) => {
	return fetch(baseUrl, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8;'
		},
		body: JSON.stringify(newDeal)
	})
	.then(response => {
		if(!response.ok) {
			throw new Error('Failed to add deal');
		}
	})
}

export const getActualDeals = () => {
	return fetch(baseUrl)
		.then(response => {
			if(response.ok) {
				return response.json();
			}
		})
		.then(deals => deals.map(({_id, ...dealProps}) => (
				{
					id: _id,
					...dealProps
				}
		)))
}

export const updateDealStatus = (changedDeal, dealId) => {
	return fetch(`${baseUrl}/${dealId}`, {
		method: 'PUT',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8;'
		},
		body: JSON.stringify(changedDeal)
	})
	.then(response => {
		if(!response.ok) {
			throw new Error('Failed to change deal property');
		}
	})
}

export const deleteCurrentDeal = (dealId) => {		
	return fetch(`${baseUrl}/${dealId}`, {
		method: 'DELETE'
	})
	.then(response => {
		if(!response.ok) {
			throw new Error('Failed to delete deal');
		}
	})
};