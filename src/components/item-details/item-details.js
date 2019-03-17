import React, { Component } from 'react';

import './item-details.css';

import SwapiService from '../../services/swapi-service';
import Spinner from '../spinner';
import ErrorButton from '../error-button';

const Record = ({ item, field, label }) => {
  return (
    <li className="list-group-item">
      <span className="term">{label}</span>
      <span>{item[field]}</span>
    </li>
  );
};

export {
  Record
};

export default class ItemDetails extends Component {

  swapiService = new SwapiService();

  state = {
    item: null,
    image: null
  };

  componentDidMount() {
    this.updateItem();
  }

  componentDidUpdate(prevProps) {
    if (this.props.itemId !== prevProps.itemId || 
        this.props.getData !== prevProps.getData ||
        this.props.getImageUrl !== prevProps.getImageUrl) {
      this.updateItem();
    };
  };

  updateItem() {
    const { itemId, getData, getImageUrl } = this.props;

    if (!itemId) {
      return;
    };

    getData(itemId)
      .then((item) => {
        this.setState({
            item,
            image: getImageUrl(item)
          })
      });
  };

  render() {

    if (!this.state.item) {
      return <span>Select a item from a list</span>;
    };

    const { item, item: { id }, image } = this.state;
    const { itemId, children } = this.props;

    const content = (+id === +itemId) ? <ItemView item={item} image={image} children={children} /> : <Spinner />;

    return (
      <div className="item-details card">
        {content}
      </div>
    );
  };
};

const ItemView = ({item, image, children}) => {

  const {id, name} = item;

  return (
    <React.Fragment>
        <img className="item-image"
          src={image} alt="" />

        <div className="card-body" key={id}>
          <h4>{name}</h4>
          <ul className="list-group list-group-flush">
            {
              React.Children.map(children, (child) => {
                return React.cloneElement(child, { item });
              })
            }
          </ul>
          <ErrorButton />
        </div>
    </React.Fragment>
  );
};