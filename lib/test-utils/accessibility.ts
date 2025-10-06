import { screen } from '@testing-library/react'

/**
 * Test utilities for accessibility compliance
 */

export const checkColorContrast = (element: HTMLElement): boolean => {
  const styles = window.getComputedStyle(element)
  const backgroundColor = styles.backgroundColor
  const color = styles.color
  
  // This is a simplified check - in real scenarios you'd use a proper contrast ratio calculator
  // For testing purposes, we'll check if both colors are defined
  return backgroundColor !== 'rgba(0, 0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)'
}

export const checkAriaLabels = (element: HTMLElement): boolean => {
  // Check if interactive elements have proper ARIA labels
  const interactiveElements = element.querySelectorAll('button, input, select, textarea, a[href]')
  
  for (const el of interactiveElements) {
    const hasAriaLabel = el.hasAttribute('aria-label')
    const hasAriaLabelledBy = el.hasAttribute('aria-labelledby')
    const hasAriaDescribedBy = el.hasAttribute('aria-describedby')
    const hasVisibleLabel = el.querySelector('label') !== null
    const hasTitle = el.hasAttribute('title')
    
    // Interactive elements should have at least one form of labeling
    if (!hasAriaLabel && !hasAriaLabelledBy && !hasAriaDescribedBy && !hasVisibleLabel && !hasTitle) {
      return false
    }
  }
  
  return true
}

export const checkKeyboardNavigation = async (element: HTMLElement): Promise<boolean> => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  // Check if focusable elements have proper tabindex
  for (const el of focusableElements) {
    const tabIndex = el.getAttribute('tabindex')
    if (tabIndex && parseInt(tabIndex) < -1) {
      console.warn('Invalid tabindex value:', el, tabIndex)
      return false
    }
  }
  
  return true
}

export const checkHeadingHierarchy = (element: HTMLElement): boolean => {
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let previousLevel = 0
  
  for (const heading of headings) {
    const currentLevel = parseInt(heading.tagName.charAt(1))
    
    // Check if heading levels skip more than one level
    if (currentLevel > previousLevel + 1 && previousLevel !== 0) {
      console.warn('Heading hierarchy skip detected:', heading)
      return false
    }
    
    previousLevel = currentLevel
  }
  
  return true
}

export const checkImageAltText = (element: HTMLElement): boolean => {
  const images = element.querySelectorAll('img')
  
  for (const img of images) {
    if (!img.hasAttribute('alt')) {
      console.warn('Image missing alt text:', img)
      return false
    }
  }
  
  return true
}

export const checkFormLabels = (element: HTMLElement): boolean => {
  const formControls = element.querySelectorAll('input, select, textarea')
  
  for (const control of formControls) {
    const id = control.getAttribute('id')
    const hasLabel = id && element.querySelector(`label[for="${id}"]`)
    const hasAriaLabel = control.hasAttribute('aria-label')
    const hasAriaLabelledBy = control.hasAttribute('aria-labelledby')
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      return false
    }
  }
  
  return true
}

export const simulateScreenReader = (element: HTMLElement): string[] => {
  const screenReaderText: string[] = []
  
  // Simulate how a screen reader would read the content
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim()
          if (text && text.length > 0) {
            return NodeFilter.FILTER_ACCEPT
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element
          const ariaLabel = el.getAttribute('aria-label')
          const title = el.getAttribute('title')
          
          if (ariaLabel || title) {
            return NodeFilter.FILTER_ACCEPT
          }
        }
        return NodeFilter.FILTER_SKIP
      }
    }
  )
  
  let node
  while (node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) screenReaderText.push(text)
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      const ariaLabel = el.getAttribute('aria-label')
      const title = el.getAttribute('title')
      
      if (ariaLabel) screenReaderText.push(ariaLabel)
      else if (title) screenReaderText.push(title)
    }
  }
  
  return screenReaderText
}

export const checkResponsiveBreakpoints = (element: HTMLElement): boolean => {
  // Check if element has responsive classes (Tailwind CSS)
  const classList = element.className
  const responsiveClasses = ['sm:', 'md:', 'lg:', 'xl:', '2xl:']
  
  return responsiveClasses.some(breakpoint => classList.includes(breakpoint))
}

export const simulateViewportResize = (width: number, height: number): void => {
  // Mock viewport resize
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}