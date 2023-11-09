/* eslint testing-library/no-container: 0, testing-library/no-node-access: 0, testing-library/no-wait-for-side-effects: 0 */
import { render } from '@testing-library/react';
import {AttemptView} from '../LandingPage/AttemptView'

var testAttempt = {
    title: 'test1',
    description: 'This is a test description',
    complexity: 'easy',
    category: 'strings',
}

test('params passed in are filled appropriately', async() => {
    var {container} = render(
        <AttemptView 
            attempt = {testAttempt} 
            setIsList = {()=>{}}/>
    );

    var attemptTitle = container.getElementsByClassName('attempt-q-name')[0];
    var attemptComplexity = container.getElementsByClassName('user-q-tag')[0];
    var attemptCategory = container.getElementsByClassName('user-q-tag')[1];
    var attemptDesc = container.getElementsByClassName('attempt-q-desc')[0];
    //insert line to fetch attempt code

    expect(attemptTitle.textContent).toBe(testAttempt.title);
    expect(attemptComplexity.textContent).toBe(testAttempt.complexity);
    expect(attemptCategory.textContent).toBe(testAttempt.category);
    expect(attemptDesc.textContent).toBe(testAttempt.description);

});