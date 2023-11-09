/* eslint testing-library/no-container: 0, testing-library/no-node-access: 0, testing-library/no-wait-for-side-effects: 0 */
import { QuestionForm, MISSING_FIELD_ERROR_MESSAGE} from '../QuestionList/QuestionForm';
import { render, fireEvent, waitFor } from '@testing-library/react';
import {Question} from '../QuestionList/Question'

const duplicateTitleMessage = "Question title already exists. Please enter new title!";
const duplicateDescriptionMessage = "Question description already exists. Please enter new description!"

test('should show missing field error for missing title', async () => {
    const {container} = render(
    <QuestionForm 
        questionNumber={1}
          qId={1}
          setAddQ={()=>{}}
          setQId={()=>{}}
          addQuestion={()=>{}}/>)
    
    var errorList = container.getElementsByClassName('error-text');
    expect(errorList.length).toBe(0);

    var qTitle = container.getElementsByClassName('q-form-title')[0];
    var qTopic = container.getElementsByClassName('q-form-tag')[0];
    var qDesc = container.getElementsByClassName('q-form-description')[0];

    fireEvent.change(qTitle, { target: { value: '' } });
    fireEvent.change(qTopic, { target: { value: 'strings' } });
    fireEvent.change(qDesc, { target: { value: 'This is a test description' } });

    var submitBtn = container.getElementsByClassName('submit-btn')[0];

    fireEvent.click(submitBtn);

    errorList = container.getElementsByClassName('error-text');
    expect(errorList.length).toBe(1);
    expect(errorList[0].textContent).toBe(MISSING_FIELD_ERROR_MESSAGE);
    
});

test('should show missing field error for missing topic', async () => {
    const {container} = render(
    <QuestionForm 
        questionNumber={1}
          qId={1}
          setAddQ={()=>{}}
          setQId={()=>{}}
          addQuestion={()=>{}}/>)

    var errorList = container.getElementsByClassName('error-text');
    expect(errorList.length).toBe(0);
    
    var qTitle = container.getElementsByClassName('q-form-title')[0];
    var qTopic = container.getElementsByClassName('q-form-tag')[0];
    var qDesc = container.getElementsByClassName('q-form-description')[0];

    fireEvent.change(qTitle, { target: { value: 'test1' } });
    fireEvent.change(qTopic, { target: { value: '' } });
    fireEvent.change(qDesc, { target: { value: 'This is a test description' } });

    var submitBtn = container.getElementsByClassName('submit-btn')[0];

    fireEvent.click(submitBtn);

    errorList = container.getElementsByClassName('error-text');
    expect(errorList.length).toBe(1);
    expect(errorList[0].textContent).toBe(MISSING_FIELD_ERROR_MESSAGE);
    
});

test('should show missing field error for missing description', async () => {
    const {container} = render(
    <QuestionForm 
        questionNumber={1}
          qId={1}
          setAddQ={()=>{}}
          setQId={()=>{}}
          addQuestion={()=>{}}/>)

    var errorList = container.getElementsByClassName('error-text');
    expect(errorList.length).toBe(0);
    
    var qTitle = container.getElementsByClassName('q-form-title')[0];
    var qTopic = container.getElementsByClassName('q-form-tag')[0];
    var qDesc = container.getElementsByClassName('q-form-description')[0];

    fireEvent.change(qTitle, { target: { value: 'test1' } });
    fireEvent.change(qTopic, { target: { value: 'strings' } });
    fireEvent.change(qDesc, { target: { value: '' } });

    var submitBtn = container.getElementsByClassName('submit-btn')[0];

    fireEvent.click(submitBtn);

    errorList = container.getElementsByClassName('error-text');
    expect(errorList.length).toBe(1);
    expect(errorList[0].textContent).toBe(MISSING_FIELD_ERROR_MESSAGE);
    
});

class Response {
    constructor(status, error, question) {
        this.status = status;
        this.error = error;
        this.question = question;
    }

    async json() {
        return {"errors": this.error, "question": this.question}
    }
}

test('should show duplicate title error for duplicate q title', async () => {
    const {container} = render(
    <QuestionForm 
        questionNumber={1}
          qId={1}
          setAddQ={()=>{}}
          setQId={()=>{}}
          addQuestion={async(ignore) => {return new Response(400, {"duplicateTitle": duplicateTitleMessage}, null)}}/>)

    var errorList = container.getElementsByClassName('error-text');
    expect(errorList.length).toBe(0);
    
    var qTitle = container.getElementsByClassName('q-form-title')[0];
    var qTopic = container.getElementsByClassName('q-form-tag')[0];
    var qDesc = container.getElementsByClassName('q-form-description')[0];

    fireEvent.change(qTitle, { target: { value: 'test1' } });
    fireEvent.change(qTopic, { target: { value: 'strings' } });
    fireEvent.change(qDesc, { target: { value: 'This is a test description' } });

    var submitBtn = container.getElementsByClassName('submit-btn')[0];
    
    fireEvent.click(submitBtn); 
    await waitFor(() => {errorList = container.getElementsByClassName('error-text'); expect(errorList.length).toBe(1);});
    await waitFor(() => {errorList = container.getElementsByClassName('error-text'); expect(errorList[0].textContent).toBe(duplicateTitleMessage);});
});

test('should show duplicate desc error for duplicate q desc', async () => {
    const {container} = render(
    <QuestionForm 
        questionNumber={1}
        qId={1}
        setAddQ={()=>{}}
        setQId={()=>{}}
        addQuestion={async(ignore) => {return new Response(400, {"duplicateDescription": duplicateDescriptionMessage}, null)}}/>)

    var errorList = container.getElementsByClassName('error-text');
    expect(errorList.length).toBe(0);
    
    var qTitle = container.getElementsByClassName('q-form-title')[0];
    var qTopic = container.getElementsByClassName('q-form-tag')[0];
    var qDesc = container.getElementsByClassName('q-form-description')[0];

    fireEvent.change(qTitle, { target: { value: 'test1' } });
    fireEvent.change(qTopic, { target: { value: 'strings' } });
    fireEvent.change(qDesc, { target: { value: 'This is a test description' } });

    var submitBtn = container.getElementsByClassName('submit-btn')[0];
    
    fireEvent.click(submitBtn); 
    await waitFor(() => {errorList = container.getElementsByClassName('error-text'); expect(errorList.length).toBe(1);});
    await waitFor(() => {errorList = container.getElementsByClassName('error-text'); expect(errorList[0].textContent).toBe(duplicateDescriptionMessage);});
});

var testQ = {
    title: 'test1',
    description: 'This is a test description',
    complexity: 'easy',
    category: 'strings',
    language: 'Other Languages'
}

test('show form view with existing details when edit is clicked', async()=> {
    const {container} = render(
        <Question
            key={1} 
            question={testQ} 
            i={1} 
            deleteQuestion={()=>{}} 
            updateQuestion={()=>{}}
        />
    )

    var editBtn = container.getElementsByClassName('q-edit')[0];

    fireEvent.click(editBtn);
    
    var qEditForm = container.getElementsByClassName('form-container');
    expect(qEditForm.length).toBe(1);
    qEditForm = qEditForm[0];

    var qTitle = qEditForm.getElementsByClassName('q-form-title')[0];
    var qDifficulty = qEditForm.getElementsByClassName('dropdown-menu')[0].getElementsByTagName("select")[0];
    var qTopic = qEditForm.getElementsByClassName('q-form-tag')[0];
    var qLang = qEditForm.getElementsByClassName('dropdown-menu')[1].getElementsByTagName("select")[0];
    var qDesc = qEditForm.getElementsByClassName('q-form-description')[0];

    expect(qTitle.value).toBe(testQ.title);
    expect(qDifficulty.value).toBe(testQ.complexity);
    expect(qTopic.value).toBe(testQ.category);
    expect(qLang.value).toBe(testQ.language);
    expect(qDesc.value).toBe(testQ.description);
    
})

test('close edit view when cancel is clicked', async()=> {
    const {container} = render(
        <Question
            key={1} 
            question={testQ} 
            i={1} 
            deleteQuestion={()=>{}} 
            updateQuestion={()=>{}}
        />
    )

    var editBtn = container.getElementsByClassName('q-edit')[0];

    fireEvent.click(editBtn);

    var qEditForm = container.getElementsByClassName('form-container');
    expect(qEditForm.length).toBe(1);
    qEditForm = qEditForm[0];

    var cancelBtn = qEditForm.getElementsByClassName('cancel-btn')[0];

    fireEvent.click(cancelBtn);

    qEditForm = container.getElementsByClassName('form-container');
    expect(qEditForm.length).toBe(0);
    
})