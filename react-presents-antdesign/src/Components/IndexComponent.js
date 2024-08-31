import React from 'react';
import { Carousel, Collapse } from 'antd';

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
    const onChange = (key) => {
        console.log(key);
      };

    return (
        <>
        <h1>How to use?</h1>
            <Carousel arrows infinite={false}>
                <div>
                    <h3 style={contentStyle}>Create your account</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>Create presents</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>Add friends</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>Choose presents from others to give them</h3>
                </div>
            </Carousel>
        <h2>More useful information</h2>
            <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />
        </>
    )
}

export default IndexComponent;