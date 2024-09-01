import React from 'react';



let IndexComponent = () => {



    return (
        <div className='index-container'>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <h1 className='index-title'>How to use?</h1>
            <div className='steps'>
              <div class="step">
                <div class="step-icon">1</div>
                <div class="step-content">
                  <h3 class="step-title">Create your account</h3>
                </div>
              </div>
              <div class="step">
                <div class="step-icon">2</div>
                <div class="step-content">
                  <h3 class="step-title">Create present</h3>
                </div>
              </div>
              <div class="step">
                <div class="step-icon">3</div>
                <div class="step-content">
                  <h3 class="step-title">Add friends</h3>
                </div>
              </div>
              <div class="step">
                <div class="step-icon">4</div>
                <div class="step-content">
                  <h3 class="step-title">Choose presents from others to give them</h3>
                </div>
              </div>
            </div>  
        <div className="container-accordion">
        <h2 className='index-title2'>More useful information</h2>
          <details>
            <summary>Which users lists can I see?</summary>
            <div className='summary-content'>
              <p>You can see the lists of users who have added you as a friend.</p>
              <p>Just because you added them doesn't mean they've added you back.</p>
              <b>Ask your friends to add you!</b>
            </div>  
          </details>
          <details>
            <summary>What information do I need to create a gift?</summary>
            <div className='summary-content'>
              <b>Provide the name of the item, description, url and price.</b>
              <p>Make sure the URL is correct; it will help your friends a lot.</p>
              <p>Futhermore, you can also add very useful information to the description, 
              such as the color of the item.</p>
            </div>  
          </details>
          <details>
            <summary>How do I let my friends know that I want to give them this gift?</summary>
            <div className='summary-content'>
              <p>Searching your friend's present list using their email, you'll have the option to select 
              one gift using the 'choose' button.</p> 
              <p>You can choose more that one gift of that friend.</p>
              <p>You cannot choose gifts that have already been selected by another user or your own gifts.</p> 
              <b>Warning: You cannot view the lists of users who do not have you on their friends list.</b>
            </div>  
            </details>
        </div>
      </div>
    )
}

export default IndexComponent;