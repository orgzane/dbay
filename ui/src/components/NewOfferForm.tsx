import React from 'react';
import {toast} from 'react-semantic-toasts';
import {Button, Dropdown, Form, FormProps, Input, TextArea, Radio} from 'semantic-ui-react';
import {useParty, useExerciseByKey} from '@daml/react';
import * as market from '@daml2ts/market/lib/market-0.1.0/Market';

type Props = {
    handleCloseForm: () => void;
};

const NewOfferForm : React.FC<Props> = ({handleCloseForm}) => {
  const party = useParty();
  const [recurring, setRecurring] = React.useState(false)
  const [currentForm, setState] = React.useState<market.NewOffer>(
      {title:''
        , description:''
        , photoLink:''
        , price:''
        , currency: market.Currency.USD
        , period: market.Period.Once
        , observers: []}
  );

  const [exerciseNewOffer] = useExerciseByKey(market.User.NewOffer);

  const onChange = (e:any, {name, value}:any) => {
    if (e)
      e.preventDefault()
    if (name === 'client')
      setState({...currentForm, observers:[value]})
    else
      setState({...currentForm, [name]:value})
  };

  const handleSubmit = async (event : React.FormEvent<HTMLElement>, data : FormProps) => {
    if (event)
      event.preventDefault();

    await exerciseNewOffer(party, currentForm);
    handleCloseForm();
    toast({
      title: 'Success',
      type: 'success',
      time: 3000,
      description: 'Created new offer.',
    });
  };

  const CurrencyDropdown = () => (
    <Dropdown
      name='currency'
      placeholder='Select Currency'
      value={currentForm.currency}
      fluid
      selection
      options={currencyOptions}
      onChange={onChange}
    />
  );
  const currencyOptions = [
    {key: 'CHF',
     text: 'CHF',
     value: market.Currency.CHF
    },
    {key: 'USD',
     text: 'USD',
     value: market.Currency.USD
    }
  ];

  const RecurringDropdown = () => (
    recurring
    ?
      <Dropdown
        name='period'
        placeholder='Select period'
        value={currentForm.period}
        fluid
        selection
        options={recurringOptions}
        onChange={onChange}
      >
      </Dropdown>
    : <> </>
  );
  const recurringOptions = [
    {key: 'Daily',
     text: 'Daily',
     value: market.Period.Daily
    },
    {key: 'Monthly',
     text: 'Monthly',
     value: market.Period.Monthly
    },
    {key: 'Yearly',
     text: 'Yearly',
     value: market.Period.Yearly
    }
  ];

  return(
    <Form onSubmit={handleSubmit}>
      <Form.Field
        label='Client'
        control={Input}
        placeholder='Client'
        name='client'
        onChange={onChange}
      >
      </Form.Field>
      <Form.Field
        label='Title'
        control={Input}
        placeholder='Title'
        name='title'
        onChange={onChange}
      >
      </Form.Field>
      <Form.Field
        label='Description'
        name='description'
        control={TextArea}
        placeholder='Describe your offer'
        onChange={onChange}
      >
      </Form.Field>
      <Form.Field
        label='Photo'
        name='photoLink'
        control={Input}
        placeholder='Photo url'
        onChange={onChange}
      >
      </Form.Field>
      <Input
        placeholder='Price'
        label={<CurrencyDropdown/>}
        labelPosition='right'
        name='price'
        onChange={onChange}
      >
      </Input>
      <Form.Field>
        <Radio
          toggle
          control={Radio}
          label='Recurring Payment'
          name='recurring'
          checked={recurring}
          onChange={() => setRecurring(!recurring)}
        />
      </Form.Field>
      <RecurringDropdown/>
      <Form.Group>
        <Form.Field control={Button}> Submit </Form.Field>
        <Form.Field control={Button} onClick={handleCloseForm}> Cancel </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default NewOfferForm;
