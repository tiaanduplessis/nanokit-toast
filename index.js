import React, { Component } from 'react'
import { StyleSheet, Dimensions, Animated, View, Text } from 'react-native'

import PropTypes from 'prop-types'

const { height, width } = Dimensions.get('window')

class Toast extends Component {
  state = {
    isVisible: false,
    text: '',
    opacityAnim: new Animated.Value(0.0),
    position: 'bottom'
  }

  static propTypes = {
    offset: PropTypes.number,
    fadeInDuration: PropTypes.number,
    fadeOutDuration: PropTypes.number,
    opacity: PropTypes.number
  }

  static defaultProps = {
    offset: 60,
    fadeInDuration: 200,
    fadeOutDuration: 200,
    opacity: 0.9
  }

  componentWillUnmount () {
    this._resetTimer()
  }

  show = (text, duration = 3000, position = 'bottom') => {
    this.setState({
      isVisible: true,
      text,
      position
    })

    Animated.timing(this.state.opacityAnim, {
      toValue: this.props.opacity,
      duration: this.props.fadeInDuration
    }).start(() => {
      duration && this.close(duration)
    })
  }

  close = (delay = 3000) => {
    if (!this.state.isVisible) {
      return
    }

    this._resetTimer()

    this.timer = setTimeout(() => {
      Animated.timing(this.state.opacityAnim, {
        toValue: 0.0,
        duration: this.props.fadeOutDuration
      }).start(() => {
        this.setState({
          isVisible: false
        })
      })
    }, delay)
  }

  _resetTimer = () => {
    this.timer && clearTimeout(this.timer)
  }

  _getTop = () => {
    const { offset } = this.props
    const { position } = this.state

    if (position === 'top') {
      return offset
    }

    if (position === 'center') {
      return height / 2
    }

    return height - offset
  }

  render () {
    const { isVisible, text } = this.state
    const {
      position,
      offset,
      fadeInDuration,
      fadeOutDuration,
      opacity,
      style,
      textStyle,
      children,
      ...otherProps
    } = this.props

    return isVisible ? (
      <View style={[styles.container, { top: this._getTop() }]}>
        <Animated.View
          style={[styles.content, { opacity: this.state.opacityAnim }, style]}
          {...otherProps}
        >
          {children || <Text style={[styles.text, textStyle]}>{text}</Text>}
        </Animated.View>
      </View>
    ) : null
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    elevation: 5,
    alignItems: 'center',
    zIndex: 5
  },
  content: {
    backgroundColor: '#222',
    borderRadius: 6,
    padding: 12
  },
  text: {
    color: '#fff'
  }
})

export default Toast
