/* eslint testing-library/no-container: 0, testing-library/no-node-access: 0, testing-library/no-wait-for-side-effects: 0 */
import {Attempt} from '../LandingPage/Attempt'
import { render } from '@testing-library/react';

var testAttempt = {
    title: 'test1',
    description: 'This is a test description',
    complexity: 'easy',
    category: 'strings',
}

test('params passed in are filled appropriately', async() => {
    const {container} = render(
        <Attempt 
        key = {1} 
        attempt = {testAttempt} 
        i = {1} 
        setSelectedAttempt = {() => {}} 
        setIsList = {() => {}}/>
    );
    
    var attemptTitle = container.getElementsByClassName('attempt-title')[0];
    // insert line to fetch attempt date
    var attemptComplexity = container.getElementsByClassName('user-q-tag-green')[0];
    var attemptCategory = container.getElementsByClassName('user-q-tag')[2];

    expect(attemptTitle.textContent).toBe(testAttempt.title);
    //insert expect for date 
    expect(attemptComplexity.textContent).toBe(testAttempt.complexity);
    expect(attemptCategory.textContent).toBe(testAttempt.category);


});