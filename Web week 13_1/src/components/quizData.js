// The 8 slide quizzes from "React Forms & Controlled Components" (Monday, Week 13).
// opt = [text, isCode, whyItIsRightOrWrong]
export const QUIZ = [
  { id: 1, topic: 'Controlled vs uncontrolled', q: 'Which of these inputs is a controlled component?', correct: 2, opts: [
    ['<input defaultValue="Kim" />', true, 'Uncontrolled: defaultValue only seeds the field; afterwards the DOM keeps the value.'],
    ['<input ref={inputRef} />', true, 'Uncontrolled: the value lives in the DOM and is read on demand via ref.current.value.'],
    ['<input value={name} onChange={e => setName(e.target.value)} />', true, 'Correct: value makes state the single source of truth and onChange feeds edits back.'],
    ['<input onChange={e => setName(e.target.value)} />', true, 'Not controlled: state just copies the DOM; with no value prop React does not own the display.'],
    ['<input type="file" />', true, 'File inputs cannot be controlled (read-only value for security); use a ref.'],
  ] },
  { id: 2, topic: 'Checkbox state', q: 'Which attribute holds the on/off state of a controlled checkbox?', correct: 4, opts: [
    ['value={agree}', true, 'value is the string submitted when checked, not the checked state.'],
    ['selected={agree}', true, 'selected belongs to <option>; a <select> is controlled via value on the <select>.'],
    ['defaultValue={agree}', true, 'defaultValue seeds an uncontrolled field and never stays in sync.'],
    ['onClick={agree}', true, 'onClick expects a function, and it is not a state-holding attribute.'],
    ['checked={agree}', true, 'Correct: checkbox and radio use checked (boolean), read from e.target.checked.'],
  ] },
  { id: 3, topic: 'Computed property keys', q: 'In setForm(prev => ({ ...prev, [name]: value })), what does [name] do?', correct: 1, opts: [
    ['It creates an array that contains the variable name', false, 'In an object literal, brackets mark a computed key, not an array.'],
    ['It uses the value of the variable name as the property key', false, 'Correct: if name is "email" the key becomes email, so one handler serves every field.'],
    ['It copies only the existing property called "name"', false, '...prev copies everything; [name] sets exactly one key on top.'],
    ['It marks the field as required', false, 'Validation is separate from computed keys.'],
    ['It deletes the property from the state object', false, 'Nothing is deleted; the new object keeps all old properties.'],
  ] },
  { id: 4, topic: 'preventDefault', q: 'What happens if an onSubmit handler does NOT call e.preventDefault()?', correct: 3, opts: [
    ['React cancels the submission automatically', false, 'React does not cancel it; your handler runs, then the browser still submits.'],
    ['The submit handler is skipped', false, 'The handler runs normally; the trouble comes after.'],
    ['React saves the form data to localStorage', false, 'React never persists form data on its own.'],
    ['The browser performs its default submission, typically a page reload, and the React state is lost', false, 'Correct: the default action is a navigation that discards in-memory state.'],
    ['Only the first field is submitted', false, 'Which fields are sent is unrelated to preventDefault.'],
  ] },
  { id: 5, topic: 'Validation pattern', q: 'In the validate() pattern from this lecture, how does handleSubmit know that the form is valid?', correct: 0, opts: [
    ['The returned errors object has no keys', false, 'Correct: one entry per problem, so Object.keys(errs).length === 0 means valid.'],
    ['validate() returns true', false, 'The pattern returns an object, which also says which field failed and why.'],
    ['alert() was never called', false, 'Errors should be inline; alert usage says nothing about validity.'],
    ['The inputs have aria-invalid set', false, 'aria-invalid is a result of validation exposed to assistive tech, not the test.'],
    ['The form state is null', false, 'State holds entered values; validity is computed from them.'],
  ] },
  { id: 6, topic: 'When you need a ref', q: 'Which task REQUIRES reading the DOM through a ref instead of controlled state?', correct: 2, opts: [
    ['Showing validation feedback as the user types', false, 'Controlled: state holds the text on every keystroke.'],
    ['Converting the typed text to uppercase live', false, 'Controlled: the handler can transform before storing.'],
    ['Reading the file chosen in <input type="file">', false, 'Correct: file value is read-only, so read ref.current.files.'],
    ['Pre-filling a field with saved data', false, 'Controlled: initialise state with the saved value.'],
    ['Disabling Submit until the fields are valid', false, 'Controlled: compute disabled from state.'],
  ] },
  { id: 7, topic: 'Accessibility', q: 'Which attribute links an error message to its input so screen readers announce it?', correct: 4, opts: [
    ['htmlFor', true, 'It links a <label> to an input id: it names the field, not the error.'],
    ['aria-required', true, 'It announces the field is required; nothing about the error text.'],
    ['aria-label', true, 'It gives an accessible name, not a pointer to a separate message.'],
    ['tabIndex', true, 'It changes focus order and is unrelated to messages.'],
    ['aria-describedby="email-error"', true, 'Correct: the input names the id of the element describing it, so the error is read with the field.'],
  ] },
  { id: 8, topic: 'The stuck input', q: 'A controlled input looks stuck. The handler is: form.name = e.target.value; setForm(form). Why?', correct: 1, opts: [
    ['setForm is asynchronous, so the value arrives later', false, 'Updates are batched, not lost; a new state would render in the same cycle.'],
    ['The state object is the same reference, so React sees no change and does not re-render', false, 'Correct: React compares by reference, so a mutated object looks unchanged and the input snaps back.'],
    ['Controlled inputs cannot hold objects in state', false, 'State can hold objects; the bug is mutating instead of copying.'],
    ['onChange only fires when the field loses focus', false, 'In React, onChange fires on every edit.'],
    ['The name attribute is missing', false, 'This handler never reads name; the bug is the mutation.'],
  ] },
];
