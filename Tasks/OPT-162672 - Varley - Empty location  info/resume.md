# Task Summary

## Design

- **Desktop**: [Segmentation Test](https://varleyuk.inone.useinsider.com/custom/22/segmentationTest)
- **Mobile**: [Segmentation Test](https://varleyuk.inone.useinsider.com/mobile-experiment/21/segmentationTest)

## Source Pages

- **Desktop**: [Segmentation](https://varleyuk.inone.useinsider.com/custom/22/segmentation)
- **Mobile**: [Segmentation](https://varleyuk.inone.useinsider.com/mobile-experiment/21/segmentation)

## Logic

The task involves handling a scenario where the location (city) information might be missing. Specifically, there is a custom rule that includes a list of cities in London, but in some cases, the location comes up empty. The goal is to investigate and address this issue.

- **City List**: [London Cities List](https://gist.githubusercontent.com/sahinaykkt/6dac9d1ee434956df94a8098f9026a11/raw/a8ed8f0ca0ecb71f10ad9e91b596417065d08ed0/london_cities)

### Example Issue

- The `city` value sometimes comes up empty.

### Task Requirements

1. **Identify the Input Field for City Name**:
   - Ensure the website has an input field where the user can enter the city name.

2. **Check if the Entered City is in the Predefined List**:
   - Verify if the city name entered by the user is present in the predefined list of London cities.

3. **Handle Missing City Information**:
   - If the city name is not in the predefined list or is empty, display a message or perform an alternative action to ensure a smooth user experience.
   - Example actions could include prompting the user to enter a valid city name or providing a dropdown list of valid cities.

4. **Update the Input Field**:
   - If the city name is not valid, update the input field with a valid city name or provide appropriate feedback to the user.

By implementing these steps, the website will be able to handle cases where the city information is missing or invalid, ensuring a better user experience.


### Problematic IPS
51.89.173.123
