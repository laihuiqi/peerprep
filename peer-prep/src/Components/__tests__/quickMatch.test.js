/* eslint testing-library/no-container: 0, testing-library/no-node-access: 0, testing-library/no-wait-for-side-effects: 0 */
import { render, fireEvent } from '@testing-library/react';
import {MatchButton} from '../Matching/MatchButton'

test('should open match pop up when quick match button is clicked', async() => {
    const {container} = render(<MatchButton/>);

    var quickMatchBtn = container.getElementsByClassName('find-match-button')[0];
    
    var quickMatchPopUp = container.getElementsByClassName('match-popup-overlay');
    expect(quickMatchPopUp.length).toBe(0);

    fireEvent.click(quickMatchBtn);

    quickMatchPopUp = container.getElementsByClassName('match-popup-overlay');
    expect(quickMatchPopUp.length).toBe(1);
    quickMatchPopUp = quickMatchPopUp[0];

    var qDifficulty = quickMatchPopUp.getElementsByClassName('criteria-field')[0].getElementsByTagName("select")[0];
    var qLang = quickMatchPopUp.getElementsByClassName('criteria-field')[1].getElementsByTagName("select")[0];
    var qProficiency = quickMatchPopUp.getElementsByClassName('criteria-field')[2].getElementsByTagName("select")[0];
    var qTopic = quickMatchPopUp.getElementsByClassName('criteria-field')[3].getElementsByTagName("select")[0];

    expect(qDifficulty.value).toBe("No Preference")
    expect(qLang.value).toBe("No Preference")
    expect(qProficiency.value).toBe("No Preference")
    expect(qTopic.value).toBe("No Preference")

})