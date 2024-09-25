import {render, replace, remove} from '../framework/render.js';
import EditEventView from '../view/edit-event-view.js';
import EventsItemView from '../view/events-item-view.js';
import {EDIT_CLASS} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPresenter {
  #handleDataChange = null;
  #handleModeChange = null;

  #eventsListComponent = null;
  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  constructor({eventsListComponent, onDataChange, onModeChange}) {
    this.#eventsListComponent = eventsListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event, allDestinations, allOffers) {
    this.#event = event;
    this.#destinations = allDestinations;
    this.#offers = allOffers;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventsItemView({
      event: this.#event,
      allDestinations: this.#destinations,
      allOffers: this.#offers,
      onOpenFormClick: () => this.#replaceEventToForm(),
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditComponent = new EditEventView({
      event: this.#event,
      allDestinations: this.#destinations,
      allOffers: this.#offers,
      onCloseFormClick: () => this.#replaceFormToEvent(),
      onFormSubmit: this.#handleFormSubmit
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventsListComponent.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEvent();
    }
  }

  #replaceEventToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToEvent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
    }
  };

  #handleFormSubmit = (event) => {
    this.#handleDataChange(event);
    this.#replaceFormToEvent();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, isFavorite: !this.#event.isFavorite});
  };
}
