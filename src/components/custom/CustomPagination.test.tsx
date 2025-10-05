import { describe, expect, test } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";




const renderWithRouter = (component: React.ReactElement, initialEntries?: string[]) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {component}
        </MemoryRouter>
    )
}



describe('CustomPagination.tsx', () => {
  test('should render component with default values', () => {
    renderWithRouter(<CustomPagination totalPages={5}/>);
    expect(screen.getByText('Anteriores')).toBeDefined();
    expect(screen.getByText('Siguientes')).toBeDefined();


    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
  })
  test('should disable previous button when page is 1', () => {
    renderWithRouter(<CustomPagination totalPages={5}/>);

    const previousButton = screen.getByText('Anteriores');

    expect(previousButton.getAttributeNames()).toContain('disabled');

  })
  test('should disable next button when in last page', () => {
    renderWithRouter(<CustomPagination totalPages={5}/>, ['/?page=5']);

    const nextButton = screen.getByText('Siguientes');

    expect(nextButton.getAttributeNames()).toContain('disabled');

  })
  test('should disable button 3 when we are in page 3', () => {
    renderWithRouter(<CustomPagination totalPages={10}/>, ['/?page=3']);

    const buttonTwo = screen.getByText('2');
    const buttonThree = screen.getByText('3');
    const buttonFour = screen.getByText('4');

    expect(buttonTwo.getAttribute('class')).toContain('bg-background');
    expect(buttonThree.getAttribute('class')).toContain('bg-primary');
    expect(buttonFour.getAttribute('class')).toContain('bg-background');
  })

  test('should redirect to another page when clicking number button', () => {
    renderWithRouter(<CustomPagination totalPages={10}/>, ['/?page=3']);

    const button2 = screen.getByText('2');
    const button3 = screen.getByText('3');

    expect(button2.getAttribute('class')).toContain('bg-background');
    expect(button3.getAttribute('class')).toContain('bg-primary');

    
    fireEvent.click(button2);

    expect(button3.getAttribute('class')).toContain('bg-background');
    expect(button2.getAttribute('class')).toContain('bg-primary');
  })
  
  
})


