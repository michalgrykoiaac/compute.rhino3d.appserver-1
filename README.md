


![Screenshot (129)](https://user-images.githubusercontent.com/97453175/187233761-53148333-4091-4469-a5de-0db55993064c.png)



# PROTOTYPING THE ORGANIC
A node.js server for solving Grasshopper definitions on Rhino Compute. 


https://michalgryko3dappserver.herokuapp.com/examples/prototypingOrganic/


ABOUT

Prototyping the Organic is a web app created for rapid rationlization and design created for organic forms created by AI algorithms from simple temple and image inputs. 


SECTION 1

#1.1 AI FORM CREATION- mesh generated from text and image inputs. * WIP AI generated mesh is preloaded from Kaedim currently as an example. 
This will be updated in the future to integrate a 3D Mesh GAN Generator direct into the same web browser.
This can be swapped out for other meshes with the GH script or you can experiment with manual mesh uploads and gridshell creations on the second web app below:

https://michalgryko3dappserver.herokuapp.com/examples/uploadmeshai/

RH_IN:chooseFile - upload jpg * WIP
RH_IN:enterTextPrompt - enter text prompt * WIP
RH_IN:showAIGeneratedMesh - boolean (turn on or off AI generated mesh)


SECTION 2

#2.1 PANELIZATION- turn on the wireframe to configure the type of panels.  
Choose between quad, triangular and diamond shaped panels and adjust the U and V divisions to desire amount.
RH_IN:showWireframe - boolean (turn on or off panel wireframe)
RH_IN:panelType - number (select panel type between quad, tri and diamond)
RH_IN:uDivisions - number (set uDivisions between 2 and 50)
RH_IN:vDivisions - number (set vDivisions between 2 and 50)

#2.2 COLOURING - turn on the colour and select the colour pattern.  Choose between a heat map gradient, rainbow gradient and red gradient.
RH_IN:showColour - boolean (turn on or off panel colours)
RH_IN:panelColour - number (select panel colour between heat, rainbow and red gradient ranges)

#2.3 GROUPING- Choose how the panels are grouped and by what amount.  Choose between grouping by curvature, x-axis alignment or a scattered pattern.  
K-means clustering can be activated to show most similar panel types or the grouping can be adjusted manually.
RH_IN:showGroupNumbers - boolean (turn on or off panel grouping numbers)
RH_IN:panelGroupingType - number (select panel grouping type between random scattered, single axis alignment and k-means clustering)
RH_IN:panelTypeNumber - number (select the number of panel types grouping)


SECTION 3

#3.1 GRIDSHELL- Rationalise the form using physics mesh relaxation algorithms to approximate AI mesh.  
Choose between the size of the grid for the members and the angle of rotation for the structure.
RH_IN:gridshellWireframe - boolean (turn on or off gridshell wireframe)
RH_IN:gridshellThickness - boolean (turn on or off gridshell thickness)
RH_IN:gridSize - number (select the grid size between 1 meter and 6 meters)
RH_IN:gridAngle - number (select the angle of the grid between 0 and 360 degrees)


SECTION 4

#4 DATA OUTPUT- view panelization and gridshell data created from your customization

Type of Grouping
Type of Panel
Colour Gradient
Number of Panels
Number of Panel types
Panel size

Surface Area
Member number
Shortest length
Longest length

#5 LAYERS- turn on and off additional layers before setting your final persepctive view

Terrain
People
Trees


#6 BUTTONS- move to set views to take a screenshot if desired and download final .3dm file

Plan View
Perspective View
Download

 
Prototyping the Organic is a project of IAAC, Institute for Advanced Architecture of Catalonia developed at Master in Advanced Computation for Architecture & Design in 2021/22 by:
Student: Michal Gryko  Lead faculty: David Andres Leon
