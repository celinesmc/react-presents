import React from 'react';

const contentStyle = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const items = [
    {
      key: '1',
      label: 'Which users lists can I see?',
      children: <p>You can see the lists of users who have added you as a friend. 
        Just because you added them doesn't mean they've added you back. 
        Ask your friends to add you!</p>,
    },
    {
      key: '2',
      label: 'What information do I need to create a gift?',
      children: <p>Provide the name of the item, description, url and price.
        Make sure the URL is correct; it will help your friends a lot.
        Futhermore, you can also add very useful information to the description, 
        such as the color of the item.
      </p>,
    },
    {
      key: '3',
      label: 'How do I let my friends know that I want to give them this gift?',
      children: <p>Searching your friend's present list using their email, you'll have the option to select 
        one gift using the 'choose' button. You can choose more that one gift of that friend.
        You cannot choose gifts that have already been selected by another user or your own gifts. 
        Warning: You cannot view the lists of users who do not have you on their friends list.</p>,
    },
  ];

let IndexComponent = () => {
    return (
        <div className='index-container'>
        <h1 className='index-title'>How to use?</h1>
            <ul className='index-list'>
                <li>Create your account</li>
                <li>Create presents</li>
                <li>Add friends</li>
                <li>Choose presents from others to give them</li>
            </ul>    
        <h2 className='index-title2'>More useful information</h2>
            <ul className='index-list-2'>
                <li>
                    <h4 className='info-title'>Which users lists can I see?</h4>
                    <p>You can see the lists of users who have added you as a friend.</p>
                    <p>Just because you added them doesn't mean they've added you back.</p>
                    <b>Ask your friends to add you!</b>
                </li>
                <li>
                    <h4 className='info-title'>What information do I need to create a gift?</h4>
                    <b>Provide the name of the item, description, url and price.</b>
                    <p>Make sure the URL is correct; it will help your friends a lot.</p>
                    <p>Futhermore, you can also add very useful information to the description, 
                    such as the color of the item.</p>
                </li>
                <li>
                    <h4 className='info-title'>How do I let my friends know that I want to give them this gift?</h4>
                    <p>Searching your friend's present list using their email, you'll have the option to select 
                    one gift using the 'choose' button.</p> 
                    <p>You can choose more that one gift of that friend.</p>
                    <p>You cannot choose gifts that have already been selected by another user or your own gifts.</p> 
                    <b>Warning: You cannot view the lists of users who do not have you on their friends list.</b>
                </li>
            </ul>
        </div>
    )
}

export default IndexComponent;