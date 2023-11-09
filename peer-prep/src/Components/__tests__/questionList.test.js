/* eslint testing-library/no-container: 0, testing-library/no-node-access: 0 */
import {Questions} from '../QuestionList/QuestionList'
import { render, fireEvent } from '@testing-library/react';

it('should render empty form on clicking add question', () => {
    // Render QuestionList
    const {container} = render(<Questions/>);

    // Get the Form Container Object (Should not be present)
    var qForm = container.getElementsByClassName("form-container");
    expect(qForm.length).toBe(0);

    // Get the add button and click on it
    var addQButton = container.getElementsByClassName('add-q-btn')[0];
    fireEvent.click(
        addQButton
    );
    
    // Get the Form Container Object after clicking (Should be present)
    qForm = container.getElementsByClassName("form-container");
    expect(qForm.length).toBe(1);

    // Get the the individual input fields from the Form Container Object
    qForm = qForm[0];
    var qTitle = qForm.getElementsByClassName('q-form-title')[0];
    var qDifficulty = qForm.getElementsByClassName('dropdown-menu')[0].getElementsByTagName("select")[0];
    var qTopic = qForm.getElementsByClassName('q-form-tag')[0];
    var qLang = qForm.getElementsByClassName('dropdown-menu')[1].getElementsByTagName("select")[0];
    var qDesc = qForm.getElementsByClassName('q-form-description')[0];
    
    // Check the expected values in the input fields
    expect(qTitle.value).toBe("");
    expect(qDifficulty.value).toBe("easy");
    expect(qTopic.value).toBe("");
    expect(qLang.value).toBe("SQL");
    expect(qDesc.value).toBe("");

});